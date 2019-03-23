import * as React from 'react';
import Dropzone from 'react-dropzone';
import { WrappedFieldProps } from 'redux-form';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import IconButton from 'material-ui/IconButton';
import { compose } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';

type OwnProps = {
  filedProps: WrappedFieldProps;
  labelName: string;
  exampleFile?: string;
};

type LocalState = {
  files: File[];
  filePreviewUrl: string;
  err: any;
};

type Props = {} & OwnProps & WithTranslation;

type FelaProps = FelaStyles<typeof mapStylesToProps>;

class UploadComponent extends React.Component<Props & FelaProps, LocalState> {
  componentDidUpdate() {
    if (
      this.props.filedProps.meta.initial &&
      this.props.filedProps.meta.initial === this.props.filedProps.input.value &&
      this.state.filePreviewUrl !== this.props.filedProps.meta.initial
    ) {
      this.setState({
        filePreviewUrl: this.props.filedProps.meta.initial
      });
    }
  }

  state: LocalState = {
    files: [],
    filePreviewUrl:
      this.props.filedProps.meta.initial || this.props.exampleFile || '',
    err: null
  };

  onDrop(files: File[]) {
    const textErr = this.props.t('dropzone:maxFile');
    if (!files.length) {
      this.setState({ err: textErr });
    } else {
      this.props.filedProps.input.onChange(files[0]);
      this.setState({
        files,
        filePreviewUrl: (files[0] as any).preview,
        err: null
      });
    }
  }

  handleRemove = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.filedProps.input.onChange(this.props.filedProps.meta.initial);
    this.setState({
      files: [],
      filePreviewUrl:
        this.props.filedProps.meta.initial || this.props.exampleFile
    });
  };

  get renderPreview() {
    const { exampleFile, filedProps, styles } = this.props;
    const { filePreviewUrl } = this.state;

    return (
      <div className={styles.imgContainer}>
        {filedProps.input.value &&
          filedProps.meta.initial !== filedProps.input.value && (
            <IconButton
              style={iconStyle}
              iconClassName="fa fa-times fa-2"
              onClick={this.handleRemove}
            />
          )}
        {exampleFile && filePreviewUrl === exampleFile && (
          <span style={{ margin: ' 0 1rem' }}>
            {this.props.t('dropzone:example')}
          </span>
        )}
        {filePreviewUrl ? (
          <img className={styles.img} src={filePreviewUrl} alt="exampl" />
        ) : null}
      </div>
    );
  }

  render() {
    const { styles, labelName } = this.props;
    const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg'];
    return (
      <div className={styles.container}>
        <span>{labelName}</span>
        <Dropzone
          accept={allowedFormats.join()}
          maxSize={2000000}
          acceptClassName={styles.dropzoneConfirm}
          rejectClassName={styles.dropzoneReject}
          multiple={false}
          className={styles.dropzone}
          onDrop={this.onDrop.bind(this)}
        >
          <p className={styles.button}>{this.props.t('dropzone:upload')}</p>
          {this.renderPreview}
          {this.state.err && (
            <span style={{ margin: '2rem' }}>{this.state.err}</span>
          )}
        </Dropzone>
      </div>
    );
  }
}

const container: FelaRule<Props> = props => ({
  width: '100%',
  height: 250,
  margin: '1rem 0',
  ...props.theme.mobile({
    height: 350
  })
});

const dropzone: FelaRule<Props> = props => ({
  width: '100%',
  display: 'flex',
  height: '100%',
  border: '2px dashed rgba(113, 184, 190, 1)',
  boxSizing: 'border-box',
  padding: '1rem',
  borderRadius: '.5rem',
  ...props.theme.mobile({
    flexDirection: 'column'
  })
});

const dropzoneConfirm: FelaRule<Props> = props => ({
  ...dropzone(props),
  backgroundColor: 'rgba(113, 184, 190, 0.5)',
  border: '2px dashed rgba(140, 198, 67, 1)'
});

const dropzoneReject: FelaRule<Props> = props => ({
  ...dropzone(props),
  backgroundColor: 'rgba(255,0,0,0.5)',
  border: '2px dashed #E04F5F'
});

const button: FelaRule<Props> = props => ({
  ...props.theme.items.primaryButton,
  margin: '1rem'
});

const imgContainer: FelaRule<Props> = props => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  position: 'relative',
  ...props.theme.mobile({
    flexDirection: 'column'
  })
});

const img: FelaRule<Props> = props => ({
  height: '100%',
  margin: 'auto',
  borderRadius: '.5rem',
  maxWidth: 320,
  ...props.theme.mobile({
    width: 'inherit',
    marginTop: 5,
    marginBottom: 5,
    maxHeight: 200
  })
});

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  top: 0
};

const mapStylesToProps = {
  container,
  dropzone,
  button,
  imgContainer,
  img,
  dropzoneConfirm,
  dropzoneReject
};

export const FileUploader = compose<React.ComponentClass<OwnProps>>(
  withTranslation('app'),
  FelaConnect(mapStylesToProps)
)(UploadComponent);
