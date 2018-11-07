$(document).ready(function () {
    M.AutoInit();

    var editTmpData = {};
    var editTmpKey = [];

    // event binding
    (() => {
        $("#addBtn").click(createItem);
        $("#editBtn").click(saveItem);
        $(document).on('click', '.delBtn', delItem);
        $(document).on('click', '.editBtn', editItem);
    })()

    function getData() {
        $(`#table-content`).html(`<h4 class="grey-text text-darken-2">載入中...</h4>`);
        $.ajax({
            url: `https://xn--pss23c41retm.tw/api/item`,
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
                for (const final_key in inner_element) {
                    var final_element = inner_element[final_key];
                    console.log(final_element);
                    str += `
                    <tr>
                        <td>${final_key}</td>
                        <td id="${final_key}Type">${final_element.type}</td>
                        <td id="${final_key}Name">${final_element.itemName}</td>
                        <td id="${final_key}Rule">${final_element.itemRule}</td>
                        <td class="${itemStatus(final_element.state)}">${final_element.state}</td>
                        <td>hahaha</td>
                        <td>hahaha</td>
                        <td>
                            <a href="#" class="editBtn btn-text-blue" data-key="${final_key + "&" + inner_key + "&" + key}">修改</a>
                            <a href="#" class="delBtn btn-text-red" data-key="${final_key + "&" + inner_key + "&" + key}">刪除</a>
                        </td>
                    </tr>
                    `;
                }
            }
        }
        $(`#table-content`).html(str);
    }

    function itemStatus(state) {
        return state == "已借出" ? "status-text-black" : "status-text-green";
    }

    function createItem(e) {
        e.preventDefault();
        var formData = $("#myForm").serializeArray();
        console.log(formData);
        var bool = false;
        var formObj = {};
        if (formData.length != 6) {
            alert("所有欄位皆須填寫");
            return;
        }
        for (const val of formData) {
            if (!valdateFormValue(val)) {
                bool = false;
                break;
            }
            formObj[val.name] = val.value;
            bool = true;
        }
        if (!bool) {
            alert("所有欄位皆須填寫");
        } else {
            console.log(formObj);
            $.ajax({
                url: `https://xn--pss23c41retm.tw/api/item/${formObj.itemDepart}/${formObj.itemRoom}`,
                type: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache"
                },
                data: JSON.stringify({
                    itemID: formObj.itemId,
                    itemName: formObj.itemName,
                    imgSrc: "https://imgur.com",
                    itemRule: formObj.itemRule,
                    type: formObj.itemType
                }),
                success: function (result) {
                    console.log(result);
                    alert("新增成功");
                    location.reload();
                },
                error: function (error) {
                    console.log("error:", error);
                    $(`#table-content`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
                }
            });
        }
    }

    function saveItem(e) {
        e.preventDefault();
        if (!confirm("確定要保存更改嗎?")) {
            return;
        }
        var formData = $("#myForm2").serializeArray();
        console.log(formData);
        var bool = false;
        var formObj = {};
        for (const val of formData) {
            if (!valdateFormValue(val)) {
                bool = false;
                break;
            }
            formObj[val.name] = val.value;
            bool = true;
        }
        if (!bool) {
            alert("所有欄位皆須填寫");
        } else {
            console.log(formObj);
            $.ajax({
                url: `https://xn--pss23c41retm.tw/api/item/${editTmpKey[2]}/${editTmpKey[1]}/${editTmpKey[0]}`,
                type: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache"
                },
                data: JSON.stringify({
                    itemName: formObj.itemName,
                    imgSrc: "https://imgur.com",
                    itemRule: formObj.itemRule,
                    type: formObj.itemType
                }),
                success: function (result) {
                    console.log(result);
                    alert("修改成功");
                    location.reload();
                },
                error: function (error) {
                    console.log("error:", error);
                    $(`#table-content`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
                }
            });
        }
    }

    function valdateFormValue(data) {
        var bool = false;
        switch (data.name) {
            case 'itemId':
            case 'itemRule':
            case 'itemName':
            case 'itemType':
            case 'itemDepart':
            case 'itemRoom':
                bool = data.value != "";
                return bool;
            default:
                return bool;
        }
    }

    function delItem(e) {
        e.preventDefault();
        if (e.target.dataset.key != "" && confirm("確認是否要刪除?")) {
            var keyArr = e.target.dataset.key.split("&");
            console.log(keyArr);
            $.ajax({
                url: `https://xn--pss23c41retm.tw/api/item/${keyArr[2]}/${keyArr[1]}/${keyArr[0]}`,
                type: "DELETE",
                success: function (result) {
                    console.log(result);
                    alert("刪除成功");
                    location.reload();
                },
                error: function (error) {
                    console.log("error:", error);
                    $(`#table-content`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
                }
            });
        }
    }

    function editItem(e) {
        e.preventDefault();
        editTmpKey = e.target.dataset.key.split("&");
        var itemType = $(`#${editTmpKey[0]}Type`);
        var itemName = $(`#${editTmpKey[0]}Name`);
        var itemRule = $(`#${editTmpKey[0]}Rule`);
        editTmpData = {};
        editTmpData.itemType = itemType[0].innerText;
        editTmpData.itemName = itemName[0].innerText;
        editTmpData.itemRule = itemRule[0].innerText;
        // console.log(itemType[0].innerText);
        $("#myForm2").html(`
            <div class="input-field col s12 m12">
                <select name="itemType">
                    <option value="" disabled>Choose your option</option>
                    <option value="3C" ${editTmpData.itemType == "3C" ? "selected" : ""}>3C</option>
                    <option value="文具" ${editTmpData.itemType == "文具" ? "selected" : ""}>文具</option>
                    <option value="鑰匙" ${editTmpData.itemType == "鑰匙" ? "selected" : ""}>鑰匙</option>
                    <option value="器材" ${editTmpData.itemType == "器材" ? "selected" : ""}>器材</option>
                </select>
                <label>物品類型</label>
            </div>
            <div class="input-field col s12 m12">
                <input id="itemName2" name="itemName" type="text" value="${editTmpData.itemName}">
                <label for="itemName2" class="active">物品名稱</label>
            </div>
            <div class="input-field col s12 m12">
                <select name="itemRule">
                    <option value="" disabled>Choose your option</option>
                    <option value="靜態資產" ${editTmpData.itemRule == "靜態資產" ? "selected" : ""}>靜態資產</option>
                    <option value="動態資產" ${editTmpData.itemRule == "動態資產" ? "selected" : ""}>動態資產</option>
                </select>
                <label>物品規則</label>
            </div>
            <div id="itemInfo" hidden ></div>
        `);
        $('input#input_text, textarea#textarea2').characterCounter();
        $('select').formSelect();
        var instances = M.Modal.init(document.querySelector('#editForm'));
        instances.open();
    }
});