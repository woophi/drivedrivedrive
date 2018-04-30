declare module 'react-loadable';
declare module 'react-spring';

declare module 'react-fela' {
  import { Omit } from 'ramda';
  import { MluviiTheme } from 'ui/shared/mluviiUI';

  type ComponentClass<P> = React.ComponentClass<P>;
  type StatelessComponent<P> = React.StatelessComponent<P>;
  type FunctionalComponent<P> = (props: P) => React.ReactElement<P>;
  type Component<P> = ComponentClass<P> | StatelessComponent<P>;

  interface FelaThemeProps {
    theme: MluviiTheme
  }

  type FelaRule<TOwnProps = {}> = (props?: TOwnProps & FelaThemeProps) => React.CSSProperties;

  interface FelaStyles<S> {
    styles: {[key in keyof S]: string}
  }

  interface ComponentDecorator<TM> {
    <T = {}>(component: Component<T & FelaStyles<TM>>): ComponentClass<T> | ComponentClass<Omit<T, 'styles'>>;
  }

  export function connect<T>(mapStylesToProps: T): ComponentDecorator<T>;
}
