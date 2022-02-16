#!/bin/bash
# REQUIREMENTS:
# - AWS instance
# - Domain name pointing to AWS IP
# - admin email address (for certbot)
# - system mailing address
# - DB credentials

# Color helpers
red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
bold=`tput bold`
reset=`tput sgr0`
export GENERATE_SOURCEMAP=false

function test_success {
if [ $? -ne "0" ]; then
  echo "E:${red} Something went wrong. Aborting!${reset}"
  exit 1
fi 
}

## Check that we're running as root
if [ "$(id -u)" -ne "0" ]; then
    echo "E:${red} Run $0 as root (or use sudo(8)).${reset}"
    exit 1
fi

function read_args {
echo 'We need a little more infomation before we can'
echo "get started..."
echo ''

echo '* Enter a database URI to be used by the LIMS backend. This must be'
echo '* an existing LIMS database.'
echo '* Example: mysql://username:password@example.com:3306/db'
while read -p 'DB_URI: ' DB_URI && ! [[ "$DB_URI" =~ .*://.* ]] ;do
    echo "${yellow}Enter a valid input${reset}"
done 

echo '* Choose a domain name to host the system from. This is the hostname'
echo '* that users will use to access the site.'
echo '* Example: yourdomain.com'
while read -p 'DOMAIN_NAME: ' DOMAIN_NAME &&  [[ -z "$DOMAIN_NAME" ]] ;do
    echo "${yellow}Enter a valid input${reset}"
done 

echo '* Enter the administrator email address, critical system alerts will be'
echo '* sent to this address.'
while read -p 'ADMIN_EMAIL: ' ADMIN_EMAIL &&  [[ -z "$ADMIN_EMAIL" ]] ;do
    echo "${yellow}Enter a valid input${reset}"
done 

echo '* Enter the system email details, this is the email that the system'
echo '* will use to send client notifications.'
while read -p 'SYSTEM_EMAIL: ' SYSTEM_EMAIL &&  [[ -z "$SYSTEM_EMAIL" ]] ;do
    echo "${yellow}Enter a valid input${reset}"
done 

echo '* Enter the password for this account '
while read -p 'PASSWORD: ' SYSTEM_EMAIL_PASSWORD &&  [[ -z "$SYSTEM_EMAIL_PASSWORD" ]] ;do
    echo "${yellow}Enter a valid input${reset}"
done 

echo '* Enter the mail server to send mail via '
while read -p 'MAIL_SERVER: ' MAIL_SERVER &&  [[ -z "$MAIL_SERVER" ]] ;do
    echo "${yellow}Enter a valid input${reset}"
done 
}

# print banner
echo "${green}"
echo '========================================================================'
echo '                   ##       #### ##     ##  ######  '
echo '                   ##        ##  ###   ### ##    ## '
echo '                   ##        ##  #### #### ##       '
echo '                   ##        ##  ## ### ##  ######  '
echo '                   ##        ##  ##     ##       ## '
echo '                   ##        ##  ##     ## ##    ## '
echo '                   ######## #### ##     ##  ###### '
echo '======================================================================='
echo "${reset}${bold}"
echo 'Welcome to the LIMS Client Portal Installer!'
echo "${reset}"

if [ $# -eq 1 ]; then
  source $1
else
  read_args
  test_success
fi

echo "I: Beginning installation"

# install dependencies
echo "I: Installing system packages"
apt update && apt upgrade -y 
apt install -y nginx certbot npm python3-pip python3-virtualenv uwsgi \
  uwsgi-plugin-python3 mysql-client libmysqlclient-dev python3-certbot-nginx
echo "I: ${green}System Packages Installed!${reset}"

# Generate config 
echo "I: Building configuration"
envsubst < conf/nginx.conf '$DOMAIN_NAME' > /etc/nginx/sites-enabled/default
test_success
envsubst < conf/uwsgi.service > /etc/systemd/system/uwsgi.service
test_success
envsubst < conf/uwsgi.ini > backend_server/uwsgi.ini
test_success
envsubst < conf/config.js > react_core/config.js
test_success
envsubst < conf/config.py > backend_server/config.py
test_success
echo "I: ${green}Configuration built!${reset}"

# Prepare Backend 
echo "I: Installing backend"
cd backend_server
virtualenv -p python3 venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
test_success

# Install backend
cd ..
rm -rf "/var/www/backend"
cp -r backend_server "/var/www/backend"
test_success
chown www-data:www-data -R "/var/www/backend"
echo "I: ${green}Backend installed!${reset}"

# Prepare Frontend 
echo "I: Installing frontend"
cd react_core
npm install
test_success
npm run-script build
test_success

# Install Frontend 
cd ..
rm -rf "/var/www/frontend"
cp -r react_core/build "/var/www/frontend"
test_success
chown www-data:www-data -R "/var/www/frontend"
echo "I: ${green}Frontend installed!${reset}"

# start services
echo "I: Starting services"
systemctl daemon-reload
systemctl enable nginx uwsgi
test_success
systemctl restart nginx uwsgi
test_success

# lets encrypt


echo "I: Issuing SSL certs"
certbot --nginx -n --agree-tos -m $ADMIN_EMAIL --domains $DOMAIN_NAME --redirect
test_success
echo "I: ${green}SSL configured!${reset}"

echo '************************************************************************'
echo "I: ${green}All done!${reset}"

echo "That's it! The system should now be fully configured and ready to use."
echo "Open a browser at $DOMAIN_NAME to test the installation."
echo "A default admin account has been created with the credentials:"
echo "  username: admin@xytovet.com"
echo "  password: admin"
echo '************************************************************************'


# DB PASS: YsfmJJu2KiYSgVQ0GzSF