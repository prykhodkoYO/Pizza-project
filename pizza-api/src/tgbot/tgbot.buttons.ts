import { Markup } from 'telegraf';

export function menuButtons(amount: number) {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('🍕Pizzas', 'pizza'),
      Markup.button.callback('🍔Burgers', 'burger'),
      Markup.button.callback('🥤Drinks', 'drink'),
      Markup.button.callback('🧺Cart' + '(' + amount + ')', 'cart'),
    ],
    {
      columns: 3,
    },
  );
}

export function cartButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('✅Make an order', 'order'),
      Markup.button.callback('❌Clear bucket', 'deleteOrder'),
      Markup.button.callback('⬅️Back to menu', 'backToMenu'),
      Markup.button.callback('History', 'history'),
    ],
    {
      columns: 1,
    },
  );
}

export function pizzaMenu() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('🥓Carbonara', 'carbonara'),
      Markup.button.callback('🥩Meat', 'meat'),
      Markup.button.callback('🌶️Spicy', 'spicy'),
      Markup.button.callback('🧀Cheese', 'cheese'),
      Markup.button.callback('🏹Hunting', 'hunting'),
      Markup.button.callback('⬅️Back to menu', 'backToMenu'),
    ],
    {
      columns: 3,
    },
  );
}

export function burgerMenu() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('1️⃣Hamburger', 'hamburger'),
      Markup.button.callback('2️⃣Double Burger', 'doubleBurger'),
      Markup.button.callback('3️⃣Triple Burger', 'tripleBurger'),
      Markup.button.callback('4️⃣Quadro Burger', 'quadroBurger'),
      Markup.button.callback('5️⃣Penta Burger', 'pentaBurger'),
      Markup.button.callback('⬅️Back to menu', 'backToMenu'),
    ],
    {
      columns: 3,
    },
  );
}

export function drinkMenu() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('⚫Cocacola', 'cocacola'),
      Markup.button.callback('🟠Fanta', 'fanta'),
      Markup.button.callback('🟢Sprite', 'sprite'),
      Markup.button.callback('🟡Beer', 'beer'),
      Markup.button.callback('🔵Water', 'water'),
      Markup.button.callback('⬅️Back to menu', 'backToMenu'),
    ],
    {
      columns: 3,
    },
  );
}
