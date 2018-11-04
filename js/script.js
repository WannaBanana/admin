$(document).ready(function () {
    M.AutoInit();

    var depart;

    var doorStatus, rfidStatus, glassStatus;

    var type = {
        m: '管理學院',
        h: '人文學院',
        e: '教育學院',
        t: '科技學院'
    };

    (function () {
        // first run
        catchHash();
    })();

    window.onhashchange = catchHash;

    function catchHash() {
        // console.log(location.hash);
        let hash = location.hash.replace("#", "");
        switch (hash) {
            case 'm':
            case 'h':
            case 't':
            case 'e':
                $("#allRoom").html(`<h4 class="grey-text text-darken-2">載入中...</h4>`);
                getData(type[hash]);
                depart = type[hash];
                break;
            default:
                location.hash = "m";
                break;
        }
    }

    function getData(college) {
        $.ajax({
            url: `https://xn--pss23c41retm.tw/api/room/${college}`,
            type: "GET",
            success: function (result) {
                render(result);
            },
            error: function (error) {
                console.log("error:", error);
                $("#msgText").show();
                $("#msgText").html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
            }
        });
    }

    function render(data) {
        console.log(depart);
        let str = "";
        for (const key in data) {
            console.log(key);
            if (data.hasOwnProperty(key)) {
                if (getCookie("space") != "" && (JSON.parse(getCookie("space")))[depart] && (JSON.parse(getCookie("space")))[depart].indexOf(key) != -1) {
                    const element = data[key];
                    str += `
                    <div class="col s12">
                        <div class="card">
                            <div class="row">
                                <div class="col s12 m4 pr-md-0">
                                    <div class="card-image">
                                        <img src="./img/1.jpeg">
                                    </div>
                                </div>
                                <div class="col s12 m8 pl-md-0">
                                    <div class="card-stacked">
                                        <div class="card-content">
                                            <span class="card-title justify-content-between">
                                                <div class="text-bold">R${key}</div>
                                                <div>
                                                    ${checkServiceStatus(element.service)}
                                                </div>
                                            </span>
                                            <div class="row mb-0">
                                                <div class="col s12 m6">
                                                    <label>借用人: Bob</label>
                                                    <label>借用期間: 2018/10/18</label>
                                                </div>
                                                <div class="col s12 m6">
                                                    <div class="switch">
                                                        <label>
                                                            門鎖
                                                            <input id="${key == 441? "openDoor":""}" ${key != 441? "disabled":""} type="checkbox" ${checkDoor(element.equipment.doorLock.lock)}>
                                                            <span class="lever" id="${key == 441? "openDoorL":""}"></span>
                                                            ${element.equipment.doorLock.door}/${element.equipment.doorLock.lock}
                                                        </label>
                                                    </div>
                                                    <div class="switch">
                                                        <label>
                                                            RFID
                                                            <input type="checkbox" id="${key == 441? "openRfid":""}" ${key != 441? "disabled":""} ${checkDeviceStatus(element.equipment.rfid.state, "rfid")}>
                                                            <span class="lever" id="${key == 441? "openRfidL":""}"></span>
                                                        </label>
                                                    </div>
                                                    <div class="switch">
                                                        <label>
                                                            玻璃感測器
                                                            <input type="checkbox" id="${key == 441? "openGlass":""}" ${key != 441? "disabled":""} ${checkDeviceStatus(element.equipment.glassDetect.power, "glass")}>
                                                            <span class="lever" id="${key == 441? "openGlassL":""}"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col s12 my-1 divider"></div>
                                                <div class="col s6 m3 offset-m6">
                                                    <a href="#cam${key}" class="btn waves-effect waves-light w100 modal-trigger">即時影像</a>
                                                    <div id="cam${key}" class="modal modal-fixed-footer">
                                                        <div class="modal-content">
                                                            <h4>即時影像</h4>
                                                            <p>
                                                                <video id="videoElement" width="100%"></video>
                                                                <script>
                                                                    if (flvjs.isSupported()) {
                                                                        var videoElement = document.getElementById('videoElement');
                                                                        var flvPlayer = flvjs.createPlayer({
                                                                            type: 'flv',
                                                                            url: 'http://163.22.32.200:8800/live/R441.flv'
                                                                        });
                                                                        flvPlayer.attachMediaElement(videoElement);
                                                                        flvPlayer.load();
                                                                        flvPlayer.play();
                                                                    }
                                                                </script>
                                                            </p>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <a class="modal-close waves-effect waves-red btn-flat">Cancel</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col s6 m3">
                                                    <a href="#log${key}" class="btn waves-effect waves-light w100 borrowLog modal-trigger" data-id="${key}">借閱紀錄</a>
                                                    <div id="log${key}" class="modal modal-fixed-footer">
                                                        <div class="modal-content">
                                                            <h4>借閱紀錄</h4>
                                                            <p class="frame"></p>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <a class="modal-close waves-effect waves-red btn-flat">Cancel</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
            }
        }
        if (str != "") {
            $("#allRoom").html(str);
        } else {
            $("#allRoom").html("<h4 class='red-text text-darken-2'>該院別沒有教室</h4>");
        }
        $('.modal').modal();
    }

    $(document).on('click', '.borrowLog', function (e) {
        // console.log(e.target.dataset.id);
        var id = e.target.dataset.id;
        $(`#log${id} .modal-content .frame`).html(`<h4 class="grey-text text-darken-2">載入中...</h4>`);
        $.ajax({
            url: `https://xn--pss23c41retm.tw/api/reservation/${depart}/${id}`,
            type: "GET",
            success: function (result) {
                console.log(result);
                $(`#log${id} .modal-content .frame`).html(`
                <pre class="w100">${JSON.stringify(result, null, 3)}</pre>
                `);
            },
            error: function (error) {
                console.log("error:", error);
                $(`#log${id} .modal-content .frame`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
            }
        });
    });

    function checkDeviceStatus(str, type) {
        if (str == "啟動") {
            type == "rfid" ? rfidStatus = 1 : "";
            type == "glass" ? glassStatus = 1 : "";
            return "checked";
        } else if (str == "關閉") {
            type == "rfid" ? rfidStatus = 0 : "";
            type == "glass" ? glassStatus = 0 : "";
            return "";
        }
    }

    function checkServiceStatus(str) {
        if (str == "啟動") {
            return `
            <span class="circle-green"></span>
            <span class="light-text">normal</span>`;
        } else if (str == "關閉") {
            return `
            <span class="circle-orange"></span>
            <span class="light-text">oooops</span>`;
        }
    }

    function checkDoor(str) {
        if (str == "上鎖") {
            doorStatus = 0;
            return "";
        } else {
            doorStatus = 1;
            return "checked";
        }
    }

    $(document).on('click', '#openDoor', function (e) {
        var doorStatusText = ['開門', '關門'];
        var doorMethod = ['open', 'close', 'temp'];
        var time = 0;
        var data = {};
        if (!confirm(`是否要${doorStatusText[doorStatus]}?`)) {
            e.preventDefault();
            return;
        }
        $("#openDoor").attr('disabled', true);
        $("#openDoorL").css('opacity', '0.5');
        // 由關到開
        if (doorStatus == 0) {
            var choice = prompt("0: 預設為常態開啟\n1: 限時開啟");
            // temp
            if (choice == 1) {
                time = parseInt(prompt("請輸入開啟秒數:"));
                if (time <= 0) {
                    alert("請輸入大於0之秒數!");
                    location.reload();
                    return;
                } else {
                    // temp
                    data = {
                        method: doorMethod[2],
                        delay: time * 1000
                    }
                }
            } else if (choice == 0) {
                // open
                data = {
                    method: doorMethod[doorStatus]
                }
            } else {
                alert("請輸入正確選擇");
                location.reload();
                return;
            }
        }
        // 由開到關
        else if (doorStatus == 1) {
            // close
            data = {
                method: doorMethod[doorStatus]
            }
        }
        $.ajax({
            url: `https://xxx/door`,
            type: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            success: function (result) {
                console.log(result);
                $("#openDoorL").css('opacity', '1');
                alert("執行成功");
                location.reload();
            },
            error: function (error) {
                console.log(error);
                alert("發生錯誤，請稍後再試");
                location.reload();
            }
        });
    });

    $(document).on('click', '#openRfid', function (e) {
        var deviceStatusText = ['開啟', '關閉'];
        if (!confirm(`是否要${deviceStatusText[rfidStatus]}?`)) {
            e.preventDefault();
            return;
        }
        $("#openRfid").attr('disabled', true);
        $("#openRfidL").css('opacity', '0.5');
        deviceOperate("rfid");
    });
    $(document).on('click', '#openGlass', function (e) {
        var deviceStatusText = ['開啟', '關閉'];
        if (!confirm(`是否要${deviceStatusText[glassStatus]}?`)) {
            e.preventDefault();
            return;
        }
        $("#openGlass").attr('disabled', true);
        $("#openGlassL").css('opacity', '0.5');
        deviceOperate("glass");
    });

    function deviceOperate(type) {
        var tmpStatus = type == "rfid" ? rfidStatus : glassStatus;
        var tmpId = type == "rfid" ? openRfidL : openGlassL;
        var active = "";
        // 由關到開
        if (tmpStatus == 0) {
            active = "PUT";
        }
        // 由開到關
        else if (tmpStatus == 1) {
            active = "DELETE";
        } else {
            alert("發生錯誤，請稍後再試");
            location.reload();
            return;
        }
        $.ajax({
            url: `https://xxx/${type}`,
            type: active,
            headers: {
                "X-HTTP-Method-Override": active
            },
            success: function (result) {
                console.log(result);
                $(`#${tmpId}`).css('opacity', '1');
                alert("執行成功");
                location.reload();
            },
            error: function (error) {
                console.log(error);
                alert("發生錯誤，請稍後再試");
                location.reload();
            }
        });
    }
});