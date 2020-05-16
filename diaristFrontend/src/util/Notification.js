import {notification} from 'antd';

export function notificationError(description){
    notification.error({
        message: 'Notice',
        description: description
    }); 
}

export function notificationSuccess(description){
    notification.success({
        message: 'Notice',
        description: description
    }); 
}
