/* eslint-disable @typescript-eslint/restrict-plus-operands */
import admin, {
  credential,
  messaging,
  type ServiceAccount,
} from 'firebase-admin';
import config from 'config';

export const initFirebase = () => {
  try {
    const firebaseConfig: ServiceAccount = config.get('FIREBASE-ADMIN');
    admin.initializeApp({ credential: credential.cert(firebaseConfig) });
  } catch (error) {
    throw new Error('Firebase not init=======================>' + error);
  }
};

/**
 * Send a push notification to a specific device.
 * @param {string} deviceTokens - The device token of the device to send the notification to.
 * @param {object} data - Custom data to send with the notification.
 * @example {notificationData} - { title: 'New Message', body: 'You have a new message!'};
 * @example {deviceTokens} - 'string token pass here e.g.: AGzy2YdSuuiSySyFIPISrE.....';
 */
export const sendNotification = async (
  deviceToken: any,
  notificationData: any
) => {
  try {
    const message: any = { data: notificationData, token: deviceToken };
    const sendMessage = await messaging().send(message);
    if (!sendMessage) {
      throw new Error('Error sending message');
    }
    return sendMessage;
  } catch (error) {
    throw new Error('Error sending message======================>' + error);
  }
};

/**
 * Send a push notification to a multidevices.
 * @param {Array} deviceTokens - The device token of the device to send the notification to.
 * @param {object} data - Custom data to send with the notification.
 * @example {notificationData} - { title: 'New Message', body: 'You have a new message!'};
 * @example {deviceTokens} - ['token1','token2','token3','token4'];
 */
export const sendNotificationForMultiDevice = async (
  deviceTokens: string[] = [],
  notificationData: any
) => {
  try {
    if (!deviceTokens.length || !Array.isArray(deviceTokens)) {
      throw new Error(
        'No valid device tokens provided for sending notifications.'
      );
    }
    deviceTokens = deviceTokens.filter((token) => token.length > 0);

    const fieldsToSend = [
      '_id',
      'messageType',
      'product',
      'categoryId',
      'writerId',
      'chapterId',
      'ads',
      'linkToPageInTheApp',
    ];
    const filteredData: Record<string, any> = {};

    for (const field of fieldsToSend) {
      if (
        notificationData[field] !== null &&
        notificationData[field] !== undefined
      ) {
        filteredData[field] = notificationData[field];
      }
    }

    const messages = {
      notification: {
        title: notificationData.messageTitle,
        body: notificationData.messageText,
      },
      android: {
        notification: {
          imageUrl:
            config.get('S3.base_url') +
            '/' +
            // notificationData.notificationImage,
            encodeURIComponent(notificationData.notificationImage),
        },
      },
      apns: {
        payload: {
          aps: { 'mutable-content': 1 },
        },
        fcm_options: {
          image:
            config.get('S3.base_url') +
            '/' +
            encodeURIComponent(notificationData.notificationImage),
        },
      },
      data: filteredData,
      tokens: deviceTokens,
    };
    const sendMessage = await messaging().sendEachForMulticast(messages);
    if (!sendMessage) {
      throw new Error(sendMessage);
    }
    return sendMessage;
  } catch (error) {
    throw new Error(error);
  }
};
