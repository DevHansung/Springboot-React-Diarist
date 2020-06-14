import { API_BASE_URL, ACCESS_TOKEN } from '../constants/property';
import FileSaver from 'file-saver'

//////////Request API//////////
//Basic request
const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    /* response message 받는 부분 */
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

//Delete request
const deleteRequest = (options) => {
    const headers = new Headers()
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    /* response message 받는 부분 */
                    return Promise.reject(json);
                }
                return json;
            })
        );
}

//Image file upload request
const multipartRequest = (options) => {
    const headers = new Headers({
    })
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    /* response message 받는 부분 */
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

//Excel file download request
const downloadRequest = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json'
    })
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.blob().then(blob => {
                if (response.ok) {
                    const blobs = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
                    FileSaver.saveAs(blobs, "applylist.xlsx")
                }
                return blob;
            })).catch(error => {
                console.log("error")
            });
};
//////////Request API end//////////

/////event/////
export function loadAllEvent() {
    return request({
        url: API_BASE_URL + "/event",
        method: 'GET'
    });
}

export function loadEventDetail(eventid) {
    return request({
        url: API_BASE_URL + "/eventdetail/" + eventid,
        method: 'GET'
    })
}

export function loadEventApply(eventid) {
    return request({
        url: API_BASE_URL + "/eventapplys/" + eventid,
        method: 'GET'
    });
}

export function downloadExcelByEvent(eventid) {
    return downloadRequest({
        url: API_BASE_URL + "/exceldown/" + eventid,
        method: 'GET',
        responseType: 'blob'
    });
}

export function uploadEvent(username, title, text, fileList) {
    const formData = new FormData();
    formData.append('writer', username);
    formData.append('title', title);
    formData.append('text', text);
    formData.append('image', fileList);
    return multipartRequest({
        url: API_BASE_URL + "/event",
        method: 'POST',
        body: formData
    })
}

export function uploadEventApply(eventid, apply) {
    return request({
        url: API_BASE_URL + "/eventapply/" + eventid,
        method: 'POST',
        body: JSON.stringify(apply)
    })
}

export function editEvent(eventid, username, title, text) {
    const data = {
        'writer': username,
        'title': title,
        'text': text,
    }
    return request({
        url: API_BASE_URL + "/event/" + eventid,
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

export function editEventImage(eventid, username, title, text, fileList) {
    const formData = new FormData();
    formData.append('writer', username);
    formData.append('title', title);
    formData.append('text', text);
    formData.append('image', fileList);
    return multipartRequest({
        url: API_BASE_URL + "/eventimage/" + eventid,
        method: 'PUT',
        body: formData
    })
}

export function deleteEvent(eventid) {
    return request({
        url: API_BASE_URL + "/event/" + eventid,
        method: 'DELETE'
    });
}
/////event end/////

/////Board/////
export function loadAllCategory() {
    return request({
        url: API_BASE_URL + "/category",
        method: 'GET'
    });
}

export function getEnabledCategory() {
    return request({
        url: API_BASE_URL + "/enabledcategory",
        method: 'GET'
    });
}

export function uploadCategory(category) {
    return request({
        url: API_BASE_URL + "/category",
        method: 'POST',
        body: JSON.stringify({ "category": category })
    });
}

export function uploadEnabled(cateid) {
    return request({
        url: API_BASE_URL + "/category/" + cateid,
        method: 'PUT',
    });
}

export function deleteCatetory(cateid) {
    return deleteRequest({
        url: API_BASE_URL + "/category/" + cateid,
        method: 'DELETE'
    });
}

export function loadFollow(username, followname) {
    return request({
        url: API_BASE_URL + "/follow/" + username + "/" + followname,
        method: 'GET',
    });
}

export function loadFollows(username) {
    return request({
        url: API_BASE_URL + "/follows/" + username,
        method: 'GET',
    });
}

export function uploadFollow(username, followname) {
    const data = {
        "username": username,
        "followname": followname
    }
    return request({
        url: API_BASE_URL + "/follow",
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function deleteFollow(followid) {
    return request({
        url: API_BASE_URL + "/follow/" + followid,
        method: 'DELETE',
    });
}

export function loadAllBoard() {
    return request({
        url: API_BASE_URL + "/board",
        method: 'GET'
    });
}

export function loadBoardByUsername(username) {
    return request({
        url: API_BASE_URL + "/board/" + username,
        method: 'GET'
    });
}

export function loadBoardByBoid(boid, username) {
    return request({
        url: API_BASE_URL + "/board/" + boid + "/" + username,
        method: 'GET'
    });
}

export function boardinsert(board) {
    return request({
        url: API_BASE_URL + "/board",
        method: 'POST',
        body: JSON.stringify(board)
    });
}

export function editBoard(id, board) {
    return request({
        url: API_BASE_URL + "/board/" + id,
        method: 'PUT',
        body: JSON.stringify(board)
    });
}

export function editUserBoard(id, board, username) {
    return request({
        url: API_BASE_URL + "/board/" + id + "/" + username,
        method: 'PUT',
        body: JSON.stringify(board)
    });
}

export function deleteBoard(id) {
    return deleteRequest({
        url: API_BASE_URL + "/board/" + id,
        method: 'DELETE'
    });
}

export function deleteUserBoard(boid, username) {
    return deleteRequest({
        url: API_BASE_URL + "/board/" + boid + "/" + username,
        method: 'DELETE'

    });
}
/////Board end/////

/////reply/////
export function loadReplyByBoid(reid) {
    return request({
        url: API_BASE_URL + "/reply/" + reid,
        method: 'GET'
    });
}

export function uploadReply(boid, username, reply) {
    const data = { "username": username, "reply": reply }

    return request({
        url: API_BASE_URL + "/reply/" + boid,
        method: 'POST',
        body: JSON.stringify(data)
    });

}

export function uploadEditReply(reid, reply) {
    const data = { "reply": reply }
    return request({
        url: API_BASE_URL + "/reply/" + reid,
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

export function deleteReply(reid) {
    return deleteRequest({
        url: API_BASE_URL + "/reply/" + reid,
        method: 'DELETE'
    });
}
/////reply end/////

/////like/////
export function loadCountLikes(id) {
    return request({
        url: API_BASE_URL + "/countlike/" + id,
        method: 'GET'
    });
}

export function loadLike(boid, username) {
    return request({
        url: API_BASE_URL + "/loadlike/" + boid + "/" + username,
        method: 'GET'
    });
}

export function uploadLike(boid, username) {
    const data = { "username": username }
    return request({
        url: API_BASE_URL + "/like/" + boid,
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function deleteLike(likeid) {
    return request({
        url: API_BASE_URL + "/like/" + likeid,
        method: 'DELETE',
    })
}
/////like end/////

/////scrap/////
export function uploadScrap(boid, username) {
    const data = { 'username': username }

    return request({
        url: API_BASE_URL + "/scrap/" + boid,
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function deleteScrap(id, user) {
    return deleteRequest({
        url: API_BASE_URL + "/deletescrap/" + id + "/" + user,
        method: 'DELETE'
    });
}

export function deleteScrapByBsid(bsid) {
    return deleteRequest({
        url: API_BASE_URL + "/scrap/" + bsid,
        method: 'DELETE'
    });
}

export function loadScrapByUsername(username) {
    return request({
        url: API_BASE_URL + "/userscrap/" + username,
        method: 'GET'
    });
}

export function loadScrapByBoid(boid, username) {
    return request({
        url: API_BASE_URL + "/scrap/" + boid + "/" + username,
        method: 'GET'
    });
}
/////scrap end/////

/////TodoList/////
export function uploadTodoList(username, text) {
    const data = {
        'username': username,
        'text': text,
    }

    return request({
        url: API_BASE_URL + "/todolist/",
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function checkedTodoList(todoid) {
    return request({
        url: API_BASE_URL + "/checktodo/" + todoid,
        method: 'PUT',
    })
}
export function unCheckedTodoList(todoid) {
    return request({
        url: API_BASE_URL + "/unchecktodo/" + todoid,
        method: 'PUT',
    })
}

export function deleteTodoListByTodoid(todoid) {
    return deleteRequest({
        url: API_BASE_URL + "/todolist/" + todoid,
        method: 'DELETE'
    });
}

export function loadTodoList(username) {
    return request({
        url: API_BASE_URL + "/todolist/" + username,
        method: 'GET'
    });
}
/////TodoList end/////