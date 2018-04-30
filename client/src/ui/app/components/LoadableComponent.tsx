import * as React from "react";
import * as Loadable from "react-loadable";
import Animation from 'ui/app/components/preloader/Animation';

const Loading: React.SFC = () => (
  <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
    <h2 style={{ margin: 'auto' }}><Animation /></h2>
  </div>
);

type LoadableComponentProps = {
  loader: any,
  visibility: boolean,
  props?: any,
}

type LoadableComponentState = {
  loaded: boolean,
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class LoadableComponent extends React.Component<LoadableComponentProps, LoadableComponentState> {
  component: any = (): null => null;
  state: LoadableComponentState = {
    loaded: false,
    error: null,
    errorInfo: null
  }

  loadComponent = () => {
    this.component = Loadable({
      loader: this.props.loader,
      loading: Loading
    })
  }

  componentDidMount() {
    if (this.props.visibility) {
      this.loadComponent();
      this.setState({ loaded: true });
    }
  }

  componentDidUpdate(prevProps: LoadableComponentProps) {
    if (this.props.visibility && !this.state.loaded) {
      this.loadComponent();
      this.setState({ loaded: true });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('Loadable component ->', error, errorInfo);
  }

  render() {
    const { visibility } = this.props;
    if (!this.state.error) {
      return visibility && <this.component disableUpdates={!visibility} {...this.props.props} />;
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Something went wrong.</h3>
        <h4>Please refresh the application or send crash report.</h4>
        <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
          {this.state.error && this.state.error.toString()}
          <br />
          {this.state.errorInfo.componentStack.split('\n').slice(0, 8).join('\n')}
        </details>
      </div>
    );
  }
}

export default LoadableComponent;
