#-------------------------------------------------------------------------------
# STAGE 1: Setup server
#-------------------------------------------------------------------------------

FROM nginx:stable-alpine

COPY --from=yeager/tank-viewer-monorepo-base /monorepo/projects/tank-viewer-web/docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=yeager/tank-viewer-monorepo-base /monorepo/projects/tank-viewer-web/docker/default.conf /etc/nginx/conf.d/default.conf

COPY --from=yeager/tank-viewer-monorepo-base /monorepo/projects/tank-viewer-web/dist /static_webpage
