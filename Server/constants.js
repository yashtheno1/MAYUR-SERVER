MODE = 'local'
GENERAL_PATH_FOR_IMAGES = '../vendor_panel/public/assets/images/';
PATH_FOR_PRODUCT_IMAGES = GENERAL_PATH_FOR_IMAGES + 'product_images'

DATABASE_USER = MODE === 'local' ? 'root' : '';
DATABASE_PASS = MODE === 'local' ? '' : '';

SECRET_KEY = 'ashgdhasdhasbdhbchbshbc8798456s65adsd564512'

MSG_FOR_AUTH_SEND_OTP = '123411';

module.exports = {
    GENERAL_PATH_FOR_IMAGES,
    PATH_FOR_PRODUCT_IMAGES,
    DATABASE_USER,
    DATABASE_PASS,
    SECRET_KEY,
    MSG_FOR_AUTH_SEND_OTP
};