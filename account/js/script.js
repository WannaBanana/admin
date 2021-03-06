$(document).ready(function () {
    $('.modal').modal();
    $('.chips').chips();
    M.AutoInit();

    var studentID = "";

    function eventBind() {
        $(document).change(function () {
            var all = $("#test").serializeArray();
            console.log(all);
        });
        $(".checkAll1").click(function () {
            if ($(".checkAll1").prop("checked")) { //如果全選按鈕有被選擇的話（被選擇是true）
                $("input[name='room-checkbox[]']").prop("checked", true); //把所有的核取方框的property都變成勾選
                $(".checkAll2").prop("checked", true);
            } else {
                $("input[name='room-checkbox[]']").prop("checked", false); //把所有的核取方框的property都取消勾選
                $(".checkAll2").prop("checked", false);
            }
        })
        $(".checkAll2").click(function () {
            if ($(".checkAll2").prop("checked")) { //如果全選按鈕有被選擇的話（被選擇是true）
                $("input[name='room-checkbox[]']").prop("checked", true); //把所有的核取方框的property都變成勾選
                $(".checkAll1").prop("checked", true);
            } else {
                $("input[name='room-checkbox[]']").prop("checked", false); //把所有的核取方框的property都取消勾選
                $(".checkAll1").prop("checked", false);
            }
        })
    }
    eventBind();

    function getData() {
        $(`#table-content`).html(`<h4 class="grey-text text-darken-2">載入中...</h4>`);
        $.ajax({
            url: `https://xn--pss23c41retm.tw/api/user/verify`,
            type: "GET",
            success: function (result) {
                console.log(result);
                render(result);
            },
            error: function (error) {
                console.log("error:", error);
                $(`#table-content`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
            }
        });
    }
    getData();



    function render(result) {
        var str = "";
        for (const key in result) {
            const element = result[key]; // 11-30
            for (const inner_key in element) {
                const inner_element = element[inner_key];
                str += `
                <tr>
                    <td>
                        <label>
                            <input type="checkbox" name="room-checkbox[]" value="${inner_key}" />
                            <span>　</span>
                        </label>
                    </td>
                    <td>${inner_key}</td>
                    <td>${inner_element.name}</td>
                    <td>${inner_element.email}</td>
                    <td>${inner_element.idenity}</td>
                    <td>${checkStatus(inner_element.state, inner_key)}</td>
                    <td>
                        <button class="btn waves-effect modalbtn modal-trigger" data-target="modal1" 
                        onclick="getPermission(${inner_key})">權限管理</button>
                    </td>
                </tr>
                `;

            }
        }
        $(`#table-content`).html(str);
    }

    // function permissionbtn(val) {
    // ${permissionbtn(inner_key)};
    //     console.log(val);
    //     studentID = val;
    // }



    function checkStatus(status, key) {
        return status == "未驗證" ? `<a style="cursor: pointer" onclick="addNewCard(${key})">未驗證</a>` : status;
    }
});

function addNewCard(key) {
    var cardName = prompt("請輸入卡片名稱");
    var cardID = prompt("請輸入卡號");
    if (cardName == "" || cardID == "") {
        alert("卡片名稱/卡號不得為空");
        return;
    }
    console.log(cardName, cardID);
    $.ajax({
        url: `https://xn--pss23c41retm.tw/api/register/${key}`,
        type: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "cardName": cardName,
            "cardID": cardID
        }),
        success: function (result) {
            console.log(result);
            $.ajax({
                url: `https://xn--pss23c41retm.tw/api/register/verify/${key}`,
                type: "PATCH",
                headers: {
                    "X-HTTP-Method-Override": "PATCH"
                },
                success: function (result) {
                    console.log(result);
                    alert("驗證成功");
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                    alert(error.responseJSON.message);
                }
            });
        },
        error: function (error) {
            console.log(error);
            alert(error.responseJSON.message);
        }
    });
}

function getPermission(val) {
    $(`#department`).html(`<h4 class="grey-text text-darken-2">載入中...</h4>`);
    $.ajax({
        url: `https://xn--pss23c41retm.tw/api/permission/${val}/`,
        type: "GET",
        success: function (result) {
            console.log(result);
            permission(result, val);
        },
        error: function (error) {
            console.log("error:", error);
            $(`#department`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
        }
    });
}
// getPermission();

function permission(result, val) {
    var str = "";
    // var chipdata = "";
    var chipdata = [];
    if (!result.space) {
        str = `
        <div class="lineheight">
            管理學院
            <div id="m-${val}" class="chips chips-initial">
            </div>
            <script>
            console.log('m' + ${val});
            console.log(${JSON.stringify(chipdata)})
            $('#m-${val}.chips-initial').chips({
                data: ${JSON.stringify(chipdata)},
                onChipAdd: function(chipsData){
                    console.log(chipsData[0].M_Chips.chipsData);
                    addNewPermiss(${val}, chipsData[0].M_Chips.chipsData);
                }
            });
            $("#m-${val}").on('click', '.chip', function(e){
                e.preventDefault();
                console.log(e.target.innerText.replace("close", ""));
                if(confirm("是否要刪除" + e.target.innerText.replace("close", "") + '?')){
                    delRoom(e.target.innerText.replace("close", "").replace(/\\n/, ""), ${val});
                }
                
            })
            </script>
        </div>
        <div class="lineheight">
            人文學院
            <div class="chips other-chips"></div>
        </div>
        <div class="lineheight">
            科技學院
            <div class="chips other-chips"></div>
        </div>
        <div class="lineheight">
            教育學院
            <div class="chips other-chips"></div>
        </div>
        `;
        $(".modal-footer").html(`
        <div class="sendbtn">
        <a href="#!" class="modal-close waves-effect btn-flat">Cancel</a>
        <button id="subBtn" class="btn waves-effect">
        Send</button>
        `);
        $(`#department`).html(str);
        $('.other-chips').chips();
        return;
    }
    for (const key in result) {
        const element = result[key];
        for (const inner_key in element) {
            const inner_element = element[inner_key];
            for (i = 0; i < inner_element.length; i++) {
                // chipdata += `{ tag: '${inner_element[i]}', },`;
                chipdata.push({ 'tag': inner_element[i].toString() });
            }
            console.log(JSON.stringify(chipdata));
            str += `
            <div class="lineheight">
                管理學院
                <div id="m-${val}" class="chips chips-initial">
                </div>
                <script>
                console.log('m' + ${val});
                console.log(${JSON.stringify(chipdata)})
                $('#m-${val}.chips-initial').chips({
                    data: ${JSON.stringify(chipdata)},
                    onChipAdd: function(chipsData){
                        console.log(chipsData[0].M_Chips.chipsData);
                        addNewPermiss(${val}, chipsData[0].M_Chips.chipsData);
                    }
                });
                $("#m-${val}").on('click', '.chip', function(e){
                    e.preventDefault();
                    console.log(e.target.innerText.replace("close", ""));
                    if(confirm("是否要刪除" + e.target.innerText.replace("close", "") + '?')){
                        delRoom(e.target.innerText.replace("close", "").replace(/\\n/, ""), ${val});
                    }
                    
                })
                </script>
            </div>
            <div class="lineheight">
                人文學院
                <div class="chips other-chips"></div>
            </div>
            <div class="lineheight">
                科技學院
                <div class="chips other-chips"></div>
            </div>
            <div class="lineheight">
                教育學院
                <div class="chips other-chips"></div>
            </div>
            `;
            $(".modal-footer").html(`
            <div class="sendbtn">
            <a href="#!" class="modal-close waves-effect btn-flat">Cancel</a>
            <button id="subBtn" class="btn waves-effect">
            Send</button>
            `);
        }
    }
    $(`#department`).html(str);
    $('.other-chips').chips();
}

function addNewPermiss(key, data) {
    var tmp = [];
    for (const val of data) {
        tmp.push(val.tag);
    }
    console.log(tmp)
    $.ajax({
        url: `https://xn--pss23c41retm.tw/api/permission/${key}/`,
        type: "POST",
        data: JSON.stringify({
            "管理學院": tmp
        }),
        headers: {
            "Content-Type": "application/json"
        },
        success: function (result) {
            console.log(result);
            alert(result.message);
            location.reload();
        },
        error: function (error) {
            console.log(error);
            $(`#department`).html(`<h4 class="red-text text-darken-2">${error.message}</h4>`);
        }
    });
}

function delRoom(data, key) {
    console.log(data);
    $.ajax({
        url: `https://xn--pss23c41retm.tw/api/permission/${key}/`,
        type: "DELETE",
        data: JSON.stringify({
            "管理學院": [data]
        }),
        headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "DELETE"
        },
        success: function (result) {
            console.log(result);
            alert(result.message);
            location.reload();
        },
        error: function (error) {
            console.log(error);
            $(`#department`).html(`<h4 class="red-text text-darken-2">${error.message}</h4>`);
        }
    });
}