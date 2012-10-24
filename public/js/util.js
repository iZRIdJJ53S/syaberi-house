(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.util = {
    // 時間の表記修正系
    changeEasyTimeStamp: function(time_str) {
      if (!time_str) {return false;}
      var d = new Date(time_str);
      var date_txt = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
      date_txt += ' '+d.toLocaleTimeString();

      return date_txt;
    },
    getCurrentTime: function() {
      var d = new Date();
      var month = d.getUTCMonth();
      month++;
      if (month < 10) {month = "0" + month;}
      var day = d.getUTCDate();
      if (day < 10) {day="0" + day;}
      var year = d.getUTCFullYear();
      var hour = d.getUTCHours();
      if (hour < 10) {hour = "0" + hour;}
      var minute = d.getUTCMinutes();
      if (minute < 10) {minute = "0" + minute;}
      var second = d.getUTCSeconds();
      if (second < 10) {second = "0" + second;}
      var newdate = year+"-"+month+"-"+day+"T"+hour+":"+minute+":"+second+"Z";

      return newdate;
    }
  };

}).call(this);
