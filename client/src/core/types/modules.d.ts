declare module 'react-loadable';

// declare module 'reactstrap'; // Declarations are now OK, TODO: fix wrong usages

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

// declare module 'react-tippy' {
//   type ElementFunction = (props?: any) => JSX.Element;

//   export function withTooltip(element: ElementFunction, settings: object): React.ComponentClass<{}>
// }
