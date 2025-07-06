interface Item {
  name: string;
  price: number;
  amount: number;
}

interface FoodCategory {
  [key: string]: Item;
}

interface Menu {
  pizza: FoodCategory;
  burger: FoodCategory;
  drink: FoodCategory;
}

export class CartCalculator {
  menu: Menu;
  phoneNumber: string;
  customerId: number;

  constructor(menu: Menu, phoneNumber: string, customerId: number) {
    this.menu = menu;
    this.phoneNumber = phoneNumber;
    this.customerId = customerId;
  }

  getDescription(): string {
    const items: string[] = [];

    for (const categoryKey in this.menu) {
      const category = this.menu[categoryKey as keyof Menu];

      for (const itemKey in category) {
        const item = category[itemKey];

        if (item.amount > 0) {
          items.push(`${item.name}: ${item.amount}`);
        }
      }
    }

    return items.join(', ');
  }

  getOrderSummary(): string {
    let summary = 'Your order:\n';

    const processCategory = (category: FoodCategory) => {
      for (const key in category) {
        const item = category[key];
        if (item.amount > 0) {
          summary += `${item.name}: ${item.amount}\n`;
        }
      }
    };

    processCategory(this.menu.pizza);
    processCategory(this.menu.burger);
    processCategory(this.menu.drink);

    const total = this.calculateTotal();
    summary += `Order amount: ${total} hryvnias`;

    return summary === 'Your order:\n' ? 'Your order is empty.' : summary;
  }

  calculateTotal(): number {
    let total = 0;

    for (const categoryKey in this.menu) {
      const category = this.menu[categoryKey as keyof Menu];

      for (const itemKey in category) {
        const item = category[itemKey];

        if (item.amount > 0) {
          total += item.price * item.amount;
        }
      }
    }
    return total;
  }

  resetAmounts(): void {
    for (const categoryKey in this.menu) {
      const category = this.menu[categoryKey as keyof Menu];
      for (const itemKey in category) {
        category[itemKey].amount = 0;
      }
    }
    this.totalPrice = 0;
    this.totalQuantity = 0;
  }

  calculateTotalAmount(): number {
    let totalAmount = 0;

    for (const categoryKey in this.menu) {
      const category = this.menu[categoryKey as keyof Menu];

      for (const itemKey in category) {
        const item = category[itemKey];

        if (item.amount > 0) {
          totalAmount += item.amount;
        }
      }
    }

    return totalAmount;
  }
  totalPrice: number = 0;
  totalQuantity: number = 0;
}

export const menu: Menu = {
  pizza: {
    carbonara: { name: 'Carbonara', price: 100, amount: 0 },
    meat: { name: 'Meat', price: 105, amount: 0 },
    spicy: { name: 'Spicy', price: 110, amount: 0 },
    cheese: { name: 'Cheese', price: 115, amount: 0 },
    hunting: { name: 'Hunting', price: 120, amount: 0 },
  },
  burger: {
    hamburger: { name: 'Hamburger', price: 50, amount: 0 },
    doubleBurger: { name: 'DoubleBurger', price: 55, amount: 0 },
    tripleBurger: { name: 'TripleBurger', price: 60, amount: 0 },
    quadroBurger: { name: 'QuadroBurger', price: 65, amount: 0 },
    pentaBurger: { name: 'PentaBurger', price: 70, amount: 0 },
  },
  drink: {
    cocacola: { name: 'Cocacola', price: 10, amount: 0 },
    fanta: { name: 'Fanta', price: 10, amount: 0 },
    sprite: { name: 'Sprite', price: 10, amount: 0 },
    beer: { name: 'Beer', price: 15, amount: 0 },
    water: { name: 'Water', price: 5, amount: 0 },
  },
};
