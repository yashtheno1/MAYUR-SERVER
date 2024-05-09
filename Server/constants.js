MODE = 'github' //'local'
GENERAL_PATH_FOR_IMAGES = 'https://raw.githubusercontent.com/yashtheno1/MAYUR-SERVER/main';
PATH_FOR_PRODUCT_IMAGES = GENERAL_PATH_FOR_IMAGES + 'product_images'

DATABASE_HOST = MODE ===  'local' ? '192.168.1.108' : '82.180.142.51';
DATABASE_USER = MODE === 'local' ? 'root' : 'u383951428_Mayur';
DATABASE_PASS = MODE === 'local' ? '' : 'Visi@Stud10';
DATABASE = MODE === 'local' ? 'mayur_db' : 'u383951428_Mayur_Motors';
SECRET_KEY = 'ashgdhasdhasbdhbchbshbc8798456s65adsd564512'

MSG_FOR_AUTH_SEND_OTP = '123411';

module.exports = {
    GENERAL_PATH_FOR_IMAGES,
    PATH_FOR_PRODUCT_IMAGES,
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE,
    SECRET_KEY,
    MSG_FOR_AUTH_SEND_OTP
};