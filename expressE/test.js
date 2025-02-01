// k6/tests.js
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Custom metrics
const errorRate = new Rate('errors');
const checkoutDuration = new Trend('checkout_duration');

// Test configuration
export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp up
        { duration: '1m', target: 10 },   // Stay at 10 users
        { duration: '30s', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        errors: ['rate<0.1'],             // Error rate should be below 10%
    },
};

const BASE_URL = 'http://localhost:3000';
const PRODUCT_IDS = ['P1001', 'P1002', 'P1003', 'P1004', 'P1005'];

// Helper function to generate session ID
function generateSessionId() {
    return `session-${Math.random().toString(36).substring(7)}`;
}

export default function() {
    const sessionId = generateSessionId();
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'session-id': sessionId,
        },
    };

    group('Browse Products', function() {
        const productsResponse = http.get(`${BASE_URL}/api/products`, params);
        check(productsResponse, {
            'products loaded': (r) => r.status === 200,
            'has products': (r) => JSON.parse(r.body).length > 0,
        });
    });

    sleep(1);

    group('View Product Details', function() {
        const productId = randomItem(PRODUCT_IDS);
        const detailsResponse = http.get(
            `${BASE_URL}/api/products/${productId}`,
            params
        );
        
        check(detailsResponse, {
            'product details loaded': (r) => r.status === 200,
            'correct product returned': (r) => JSON.parse(r.body).id === productId,
        });
    });

    sleep(2);

    group('Add to Cart', function() {
        const cartTimer = new Date();
        const payload = JSON.stringify({
            productId: randomItem(PRODUCT_IDS),
            quantity: Math.floor(Math.random() * 3) + 1,
        });

        const cartResponse = http.post(
            `${BASE_URL}/api/cart`,
            payload,
            params
        );

        check(cartResponse, {
            'item added to cart': (r) => r.status === 201,
            'cart size increased': (r) => JSON.parse(r.body).cartSize > 0,
        }) || errorRate.add(1);

        checkoutDuration.add(new Date() - cartTimer);
    });

    sleep(3);

    group('Checkout Process', function() {
        const checkoutPayload = JSON.stringify({
            shippingAddress: {
                street: '123 Test St',
                city: 'Test City',
                zipCode: '12345',
            },
            paymentMethod: 'test_card',
        });

        const checkoutResponse = http.post(
            `${BASE_URL}/api/checkout`,
            checkoutPayload,
            params
        );

        check(checkoutResponse, {
            'checkout successful': (r) => r.status === 200,
            'order ID received': (r) => JSON.parse(r.body).orderId !== undefined,
            'order status success': (r) => JSON.parse(r.body).status === 'success',
        }) || errorRate.add(1);
    });

    sleep(5);
}