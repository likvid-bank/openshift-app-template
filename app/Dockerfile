FROM registry.access.redhat.com/ubi9/nodejs-22-minimal

WORKDIR /opt/app-root/src
COPY --chown=1001:0 package.json server.js ./
COPY --chown=1001:0 public ./public

# OpenShift runs the container with an arbitrary UID in group 0, so group permissions must match the owner's.
RUN chmod -R g=u /opt/app-root/src

USER 1001
EXPOSE 8080
CMD ["node", "server.js"]
