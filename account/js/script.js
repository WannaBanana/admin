$(document).ready(function () {
    M.AutoInit();

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
                        <a href="#">權限設定</a>
                    </td>
                </tr>`;
            }
        }
        $(`#table-content`).html(str);
    }

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
                success: function (val) {
                    console.log(val);
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