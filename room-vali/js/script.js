$(document).ready(function () {
    M.AutoInit();

    function eventBind() {
        $(document).change(function () {
            // var all = $(".checkboxForm").serializeArray();
            // console.log(all);
        });
        $("#addBtn").click(function () {
            var all = $(".checkboxForm").serializeArray();
            console.log(all);
            if (all.length <= 0) {
                alert("請先選取教室");
            } else {
                var tmp = [];
                for (var i = 0; i < all.length; i++) {
                    tmp.push(all[i].value);
                }
                if (!confirm(`確定要審核${tmp.length}筆資料?`)) {
                    return;
                }
                $.ajax({
                    url: `https://xn--pss23c41retm.tw/api/reservation/管理學院/441`,
                    type: "PUT",
                    data: JSON.stringify({
                        "keys": tmp
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "X-HTTP-Method-Override": "PUT"
                    },
                    success: function (result) {
                        console.log(result);
                        alert("審核成功");
                        location.reload();
                    },
                    error: function (error) {
                        console.log("error:", error);
                        $(`#table-content`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
                    }
                });
            }
        });
        $("#delBtn").click(function () {
            var all = $(".checkboxForm").serializeArray();
            console.log(all);
            if (all.length <= 0) {
                alert("請先選取教室");
            } else {
                var tmp = [];
                for (var i = 0; i < all.length; i++) {
                    tmp.push(delRoom(all[i].value));
                }
                if (!confirm(`確定要刪除${tmp.length}筆資料?`)) {
                    return;
                }
                Promise.all(tmp)
                    .then((val) => {
                        console.log(val);
                        alert("刪除成功");
                        location.reload();
                    })
                    .catch((err) => {
                        $(`#table-content`).html(`<h4 class="red-text text-darken-2">${err == ""? "伺服器發生問題，請稍後再試":err}</h4>`);
                    })
            }
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
        $("#bookType").change(function(){
            console.log(this.value);
            getData(this.value);
        });
    }
    eventBind();

    function getData(val) {
        var type = ["book/管理學院", "管理學院"];
        $(`#table-content`).html(`<h4 class="grey-text text-darken-2">載入中...</h4>`);
        $.ajax({
            url: `https://xn--pss23c41retm.tw/api/reservation/${type[val]}`,
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
    getData(0);

    function render(result) {
        var str = "";
        for (const key in result) {
            const element = result[key]; // 11-30
            for (const inner_key in element) {
                const inner_element = element[inner_key];
                for (const final_key in inner_element) {
                    var final_element = inner_element[final_key];
                    console.log(final_element);
                    str += `
                    <tr>
                        <td>
                            <form class="checkboxForm">
                                <label>
                                    <input type="checkbox" name="room-checkbox[]" value="${final_key}" />
                                    <span>　</span>
                                </label>
                            </form>
                        </td>
                        <td>${key}</td>
                        <td>${new Date(final_element.start).toLocaleDateString()}</td>
                        <td>${new Date(final_element.start).toLocaleTimeString().replace(":00", "")}</td>
                        <td>${new Date(final_element.end).toLocaleTimeString().replace(":00", "")}</td>
                        <td>${final_element.name}</td>
                        <td>${final_element.type == "inside"? "校內用途: " + final_element.title:"校外用途: " + final_element.title}</td>
                        <td>${final_element.repeat_type? final_element.repeat_type:"無"}</td>
                    </tr>
                    `;
                }
            }
        }
        $(`#table-content`).html(str);
    }

    function delRoom(key) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://xn--pss23c41retm.tw/api/reservation/管理學院/441/${key}`,
                type: "DELETE",
                data: JSON.stringify({
                    "deleteRepeat": false
                }),
                headers: {
                    "Content-Type": "application/json",
                    "X-HTTP-Method-Override": "DELETE"
                },
                success: function () {
                    resolve(key + " 刪除成功");
                },
                error: function (error) {
                    console.log(key + "\n");
                    console.log(error.responseJSON.message);
                    reject(error.responseJSON.message);
                }
            });
        });
    }
});