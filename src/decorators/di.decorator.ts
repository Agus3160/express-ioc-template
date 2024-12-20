import { inject, injectable } from 'inversify';
import { Constructor } from '../lib/types';

export const Injectable = (): ClassDecorator => (target) => {
  injectable()(target.prototype);
};

export const Inject =
  (identifier: Constructor<any>): ParameterDecorator =>
  (target, pk, pi) => {
    inject(identifier.name)(target, pk, pi);
  };
