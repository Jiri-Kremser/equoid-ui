FROM jboss/keycloak:3.4.3.Final

USER root

RUN mkdir -p $JBOSS_HOME/standalone/{data,log} && \
    chown -R jboss:0 $JBOSS_HOME && \
    chmod -R g+rw $JBOSS_HOME

USER jboss

