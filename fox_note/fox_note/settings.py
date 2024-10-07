"""
Django settings for fox_note project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-nefx9-mh+2l*i#v4e2alvm9v!iv1j@&7ud(+px#gukgc_6(13k'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    #setup the apps
    'home',
    'profile_auth',
    'note',

    #setup django allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'django.contrib.sites'


]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #for django allauth
    'allauth.account.middleware.AccountMiddleware'
]

ROOT_URLCONF = 'fox_note.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'profile_auth' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fox_note.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

#setup the mysql database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'foxNoteDatabase',
        'USER': 'abderrahim',
        'PASSWORD': '20020310',
        'HOST': '127.0.0.1',
        'PORT': '3306'
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    BASE_DIR / "static",  # This points to a 'static' folder in your project root
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'






#custom user model

AUTH_USER_MODEL = 'profile_auth.Profile'





#for django allauth
AUTHENTICATION_BACKENDS = (
  'django.contrib.auth.backends.ModelBackend',
  'allauth.account.auth_backends.AuthenticationBackend'
)



#for google auth
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
        'FETCH_USERINFO': True
    }
}

SITE_ID = 1

#redirect mehtod
#ACCOUNT_LOGOUT_REDIRECT_URL = 'auth/accounts/'
#LOGOUT_REDIRECT_URL = 'auth/accounts/'
#ACCOUNT_AUTHENTICATED_LOGIN_REDIRECTS = False
#LOGOUT_REDIRECT_URL = 'auth/accounts/'
#ACCOUNT_ADAPTER = 'profile_auth.adapter.profileAdapter'
#ACCOUNT_SIGNUP_REDIRECT_URL = 'auth/accounts/confirm-email/'
#LOGIN_REDIRECT_URL = '/auth/accounts/profile/'
 
#ACCOUNT_SIGNUP_REDIRECT_URL = '/auth/accounts/profile/'
#LOGIN_URL = '/auth/accounts/login/'
ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL = '/auth/accounts/login/'
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = '/auth/accounts/login/'
LOGIN_REDIRECT_URL = '/auth/accounts/login/'



#some setting
ACCOUNT_EMAIL_REQUIRED = True # Require users to provide an email
ACCOUNT_USERNAME_REQUIRED = True # Require users to provide an unsername
ACCOUNT_EMAIL_VERIFICATION = 'mandatory' # Require email verification
ACCOUNT_AUTHENTICATION_METHOD = 'email' # Use email for authentication

SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin' #for security
SOCIALACCOUNT_LOGIN_ON_GET = True #go directly to google log in page


ACCOUNT_EMAIL_CONFIRMATION_EXPIRE = 3000 #expire duration of the link send to verifie email



#configure email to send verification messages
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # Replace with your email provider's SMTP server
EMAIL_PORT = 587  # Common SMTP port for TLS
EMAIL_HOST_USER = 'python.py2002@gmail.com'
EMAIL_HOST_PASSWORD = 'obae eubv lqqx lups'  # Use an app-specific password if required
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'python.py2002@gmail.com'
ACCOUNT_EMAIL_SUBJECT_PREFIX = '' #To remove the prefix and set a custom subject


#i will fill this place by the custom email message verification that i will send








#custom the singnup form
ACCOUNT_FORMS = {'signup': 'profile_auth.forms.customSignupForm'}


ACCOUNT_ADAPTER = 'profile_auth.adapters.CustomAccountAdapter'
