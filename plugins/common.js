import Vue from 'vue'
import message from "@/components/common/message/index"
import datePicker from "@/assets/js/datePicker"
import selector from "@/components/common/selector/index"

Vue.$message = Vue.prototype.$message = message
Vue.$selector = Vue.prototype.$selector = selector