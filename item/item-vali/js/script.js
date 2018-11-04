$(document).ready(function () {
    M.AutoInit();
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
});