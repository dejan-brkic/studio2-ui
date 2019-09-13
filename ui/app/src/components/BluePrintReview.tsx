import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles(theme => ({
  review: {
    paddingTop: '40px',
    maxWidth: '600px',
    margin: 'auto'
  },
  section: {
    marginBottom: '0'
  },
  bold: {
    fontWeight: 'bold'
  },
  inline: {
    display: 'inline'
  },
  edit: {
    color: '#7E9DBB',
    '& svg': {
      fontSize: '1.2rem'
    }
  },
  noDescription: {
    color: '#a2a2a2'
  }
}));

function BluePrintReview(props: any) {
  const classes = useStyles({});

  const {onGoTo, inputs, blueprint} = props;

  const labels: any = {
    bluePrintStrategy: 'Create from blueprint',
    gitStrategy: 'Existing remote git repo clone',
    bluePrint: 'Blueprint',
    creationStrategy: 'Creation Strategy',
    additionalOptions: 'Additional Options',
    pushSite: 'Push the site to a remote Git repository after creation',
    noPushSite: 'Don\'t push the site to a remote Git repository after creation',
    remoteName: 'Remote name',
    remoteURL: 'URL',
    remoteBranch: 'Branch',
    authentication: 'Authentication',
    userNameAndPassword: 'Username & password',
    token: 'Token',
    privateKey: 'Private key'
  };

  function renderAuth(type:string) {
    if(type === 'basic') {
      return labels.userNameAndPassword;
    }else if (type === 'token'){
      return labels.token;
    }else {
      return labels.privateKey;
    }
  }

  function renderGitOptions() {
    return (<div>
        {inputs.repo_url && <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{labels.remoteURL}: </span> {inputs.repo_url}
        </Typography>}
        {inputs.repo_remote_name && <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{labels.remoteName}: </span> {inputs.repo_remote_name}
        </Typography>}
        {inputs.repo_remote_branch && <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{labels.remoteBranch}: </span> {inputs.repo_remote_branch}
        </Typography>}
        {inputs.repo_authentication !== 'none' && <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{labels.authentication}: </span> {renderAuth(inputs.repo_authentication)}
        </Typography>}
      </div>
    )
  }

  return (
    <div className={classes.review}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.section}>
            {labels.creationStrategy}
            <IconButton aria-label="goto" className={classes.edit} onClick={() => onGoTo(0)}>
              <EditIcon/>
            </IconButton>
          </Typography>
          {blueprint.id !== "GIT" ?
            <div>
              <Typography variant="body2" gutterBottom>
                {labels.bluePrintStrategy}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <span className={classes.bold}>{labels.bluePrint}: </span> {blueprint && blueprint.name}
              </Typography>
            </div>
            :
            <div>
              <Typography variant="body2" gutterBottom>
                {labels.gitStrategy}
              </Typography>
              {renderGitOptions()}
            </div>
          }
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.section}>
            Site name & description
            <IconButton aria-label="goto" className={classes.edit} onClick={() => onGoTo(1)}>
              <EditIcon/>
            </IconButton>
          </Typography>
          <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>Site IdL: </span> {inputs.siteId}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>Description: </span> {inputs.description ? inputs.description :
            <span className={classes.noDescription}>(no description supplied)</span>}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.section}>
            {labels.additionalOptions}
            <IconButton aria-label="goto" className={classes.edit} onClick={() => onGoTo(1)}>
              <EditIcon/>
            </IconButton>
          </Typography>
          {inputs.push_site ?
            <div>
              <Typography variant="body2" gutterBottom>
                {labels.pushSite}
              </Typography>
              {renderGitOptions()}
            </div> :
            <Typography variant="body2" gutterBottom>
              {labels.noPushSite}
            </Typography>
          }
        </Grid>
      </Grid>
    </div>
  )
}

export default BluePrintReview;
