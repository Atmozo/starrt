import { BubbleSort, QuickSort, SortContext } from "./sortStrategy.js";

const context = new SortContext(new BubbleSort());
console.log(context.sort([5, 2, 8, 1]));

context.setStrategy(new QuickSort());
console.log(context.sort([3, 7, 4, 9]));

