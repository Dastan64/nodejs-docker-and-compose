require('dotenv').config({ path: './.env.deploy' });

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF, DEPLOY_REPOSITORY } =
  process.env;

module.exports = {
  apps: [
    {
      name: 'nodejs-docker-backend',
      script: 'dist/main.js',
    },
  ],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPOSITORY,
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/current/backend`,
      'post-deploy':
        'cd backend && npm i && npm run build && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
