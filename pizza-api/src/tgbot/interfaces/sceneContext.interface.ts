import { Scenes } from 'telegraf';

export interface SceneContext extends Scenes.SceneContext {
  pizzaType?: 'carbonara' | 'meat' | 'spicy' | 'cheese' | 'hunting';
  drinkType?: 'cocacola' | 'fanta' | 'sprite' | 'beer' | 'water';
  burgerType?:
    | 'hamburger'
    | 'doubleBurger'
    | 'tripleBurger'
    | 'quadroBurger'
    | 'pentaBurger';
}
