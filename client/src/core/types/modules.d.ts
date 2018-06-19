declare module 'react-spring';
declare module 'react-visibility-sensor';


declare module 'react-fela' {
  import { Omit } from 'ramda';
  import { DriveTheme } from 'ui/shared/driveUI';

  type ComponentClass<P> = React.ComponentClass<P>;
  type StatelessComponent<P> = React.StatelessComponent<P>;
  type FunctionalComponent<P> = (props: P) => React.ReactElement<P>;
  type Component<P> = ComponentClass<P> | StatelessComponent<P>;

  interface FelaThemeProps {
    theme: DriveTheme
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
