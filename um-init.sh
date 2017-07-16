#!/bin/bash

# usersmanagement - Startup script for usersmanagement

# chkconfig: 35 79 14
# description: Lean35 user/group management and notification system

#. /etc/rc.d/init.d/functions
# . /lib/lsb/init-functions


# NOTE: if you change any OPTIONS here, you get what you pay for:
# this script assumes all options are in the config file.
UM_USER=usersmanagement
NAME=usersmanagement
UM_ID=$(id -u $UM_USER)
USER_HOME=/home/usersmanagement/users-management
PATH=/home/usersmanagement/.nvm/versions/node/v0.12.18/bin:$PATH
COMMAND_NAME=`which node`
echo node is $COMMAND_NAME
SERVER_PATH=$USER_HOME/dist/server
COMMAND_OPTS="$SERVER_PATH/users-management.js"
export SENDGRID_FROMEMAIL_NAME="Maryland Community Band"
export NODE_ENV=production

RUNDIR=$USER_HOME
PIDFILE=$RUNDIR/$NAME.pid

if [ -r /home/usersmanagement/env.sh ]; then
    . /home/usersmanagement/env.sh
else
    echo env file not found
fi

getpid()
{
    ps -u $UM_USER -f |awk /"$COMMAND_NAME"/' && !/awk/ { print $2 }'
}

start()
{
  echo Starting users-management
  #daemon --user "$UM_USER" "node $SERVER_PATH/users-management.js >/dev/null 2>&1"
  #runuser $UM_USER -c "node $SERVER_PATH/users-management.js >/dev/null 2>&1&"
  # Start the process using the wrapper (copied from mongod script)
  : start-stop-daemon --background --start --pidfile $PIDFILE \
                    --make-pidfile --chuid $UM_USER \
                    --exec $COMMAND_NAME $COMMAND_OPTS prod
  # Because suitable things weren't working
  cd $USER_HOME
  su $UM_USER -c "$COMMAND_NAME $COMMAND_OPTS > $SERVER_PATH/mcb-mgmt.log 2>$SERVER_PATH/mcb-mgmt.err"
  RETVAL=$?
  echo
  #[ $RETVAL -eq 0 ] && touch /var/lock/subsys/mongod
}

stop()
{
  echo Stopping users-management
  pid=$(getpid)
  if [ -n "$pid" ];then
    kill $pid
    RETVAL=$?
  else
    echo no process killed
    RETVAL=3
  fi
  echo
  #[ $RETVAL -eq 0 ] && rm -f /var/lock/subsys/mongod
}

restart () {
	stop
	start
}


RETVAL=0

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart|reload|force-reload)
    restart
    ;;
  status)
	pid=$(getpid)
	if [ -n "$pid" ]
	then
	    echo users-management start/running, process $pid
	else
	    echo users-management is NOT running
	    RETVAL=3
	fi
    ;;
  *)
    echo "Usage: $0 {start|stop|status|restart|reload|force-reload}"
    RETVAL=1
esac

exit $RETVAL
