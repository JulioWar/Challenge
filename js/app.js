Vue.use(VueResource);

let app = new Vue({
  el: '#app',
  data () {
    return {
      hello: "Hello World",
      loading: false,
      date: '',
      days: 0,
      country: 'US',
      holydays: {},
      data: [],
      months: [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ]
    }
  },
  methods: {
    getDateFormated(date) {
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();

      return year + '-' + month + '-' + day;
    },
    render() {
      this.data = [];
      let today = moment(this.date);
      let days = Number(this.days);

      let init_day = moment(this.date);
      init_day.add(-Number(today.format('e')),'days');

      let last_day = moment(today.format('YYYY-MM-DD'))
      last_day.add(days,'days');

      let end_day = moment(last_day.format('YYYY-MM-DD'))
      let last_saturday = 6 - Number(end_day.format('e'));
      end_day.add(last_saturday,'days')


      this.loading = true;
      this.$http.get('https://holidayapi.com/v1/holidays', {
          params: {
            key: '3da6bb9f-0788-489e-9795-17432560e47e',
            year: today.format('YYYY'),
            country: this.country
          }
        })
        .then(
          (res) => {
            this.holydays = res.body.holidays;
            this.loading = false;


            let month = null;
            let current_month = null;
            let cssClass = '';

            for (var d = moment(init_day.format('YYYY-MM-DD')); d <= end_day; d.add(1,'days')) {

              let uniqueMonth = d.format('MMMM YYYY');

              if(month !== uniqueMonth && d.format('e') == 0) {
                this.data.push({
                  month: uniqueMonth,
                  weeks: []
                });
                current_month = this.data[this.data.length - 1];
                month = uniqueMonth;
              } else {
                current_month = this.data.filter((item) => {
                  return item.month === uniqueMonth
                })[0];
                if(!current_month) {
                  current_month = this.data[this.data.length - 1];
                }
              }

              let holydaysResult = this.holydays.hasOwnProperty(d.format('YYYY-MM-DD'));

              let is_weekend = (d.format('e') == 0 || d.format('e') == 6);
              let is_invalid = (d < today || d >= last_day) || d.format('MMMM YYYY') !== uniqueMonth;


              if (is_invalid) {
                 cssClass = 'gray';
              } else if (holydaysResult) {
                cssClass = 'orange';
              } else if (is_weekend) {
                cssClass = 'yellow';
              } else {
                cssClass = 'green';
              }


              if (d.format('e') == 0  || current_month.weeks.length ==0) {
                current_month.weeks.push([]);
              }

              let current_week = current_month.weeks[current_month.weeks.length - 1]

              current_week.push({
                day: d.format('D'),
                is_invalid: is_invalid,
                class:cssClass
              });



            }

          },
          () => {
            this.loading = false;
          }
        )

    }
  },
  mounted () {

  }
});
