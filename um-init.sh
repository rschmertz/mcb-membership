#!/bin/bash

# usersmanagement - Startup script for usersmanagement

# chkconfig: 35 79 14
# description: Lean35 user/group management and notification system

. /etc/rc.d/init.d/functions


# NOTE: if you change any OPTIONS here, you get what you pay for:
# this script assumes all options are in the config file.
UM_USER=usersmanagement
UM_ID=$(id -u $UM_USER)
COMMAND_NAME=node
SERVER_PATH=/home/usersmanagement/dist/server
export SENDGRID_FROMEMAIL_NAME="Maryland Community Band"
export NODE_ENV=production

if [ -r /home/usersmanagement/env.sh ]; then
    . /home/usersmanagement/env.sh
fi

getpid()
{
    ps -u $UM_USER -f |awk /"$COMMAND_NAME"/' && !/awk/ { print $2 }'
}

start()
{
  echo Starting users-management
  #daemon --user "$UM_USER" "node $SERVER_PATH/users-management.js >/dev/null 2>&1"
  runuser $UM_USER -c "node $SERVER_PATH/users-management.js >/dev/null 2>&1&"
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
