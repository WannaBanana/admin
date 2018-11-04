$(document).ready(function () {
    M.AutoInit();

    var depart;

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
                if (getCookie("space") != "" && (JSON.parse(getCookie("space")))[depart] && (JSON.parse(getCookie("space")))[depart].indexOf(parseInt(key)) != -1) {
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
                                                            <input type="checkbox" disabled ${checkDeviceStatus(element.equipment.doorLock.power)}>
                                                            <span class="lever"></span>
                                                            ${element.equipment.doorLock.door}/${element.equipment.doorLock.lock}
                                                        </label>
                                                    </div>
                                                    <div class="switch">
                                                        <label>
                                                            RFID
                                                            <input type="checkbox" disabled ${checkDeviceStatus(element.equipment.rfid.state)}>
                                                            <span class="lever"></span>
                                                        </label>
                                                    </div>
                                                    <div class="switch">
                                                        <label>
                                                            玻璃感測器
                                                            <input type="checkbox" disabled ${checkDeviceStatus(element.equipment.glassDetect.power)}>
                                                            <span class="lever"></span>
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
                                                                <iframe class="w100" src="${element.equipment.webcam}"></iframe>
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
        if(str != ""){
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

    function checkDeviceStatus(str) {
        if (str == "啟動") {
            return "checked";
        } else if (str == "關閉") {
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
});