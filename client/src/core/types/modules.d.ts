declare module 'react-spring';
declare module 'react-visibility-sensor';
declare module 'react-hint';
declare module 'fela-plugin-embedded';
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

  interface IStyle extends React.CSSProperties {
    [index: string]: any;
  }

  type FelaRule<TOwnProps = {}> = (props?: TOwnProps & FelaThemeProps) => IStyle;

  interface FelaStyles<S> {
    styles: {[key in keyof S]: string}
  }

  interface ComponentDecorator<TM> {
    <T = {}>(component: Component<T & FelaStyles<TM>>): ComponentClass<T> | ComponentClass<Omit<T, 'styles'>>;
  }

  export function connect<T>(mapStylesToProps: T): ComponentDecorator<T>;

  export function connect<Props, Styles, Theme = any>(
    rules: TMultiRule<Props & FelaWithThemeProps<Theme>, Styles>,
    config?: ConnectConfig,
  ): WithRules<Props, Styles, Theme>
}
