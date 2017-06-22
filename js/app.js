Vue.use(VueResource);

let app = new Vue({
  el: '#app',
  data () {
    return {
      hello: "Hello World",
      loading: false,
      date: '',
      days: 0,
      country: '',
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
    getMonthFormated(date) {
      return this.months[date.getMonth()] + " " + date.getFullYear();
    }
  },
  mounted () {
    let today = new Date();
    let days = 3;

    let first_day_month = new Date(today)
    first_day_month.setDate(first_day_month.getDate() - first_day_month.getDate());

    let init_day = new Date(first_day_month);
    init_day.setDate(init_day.getDate() - init_day.getDay());

    let last_day = new Date(today)
    last_day.setDate(last_day.getDate() + days);

    let end_day = new Date(last_day)
    let last_saturday = 6 - end_day.getDay();
    console.log(end_day.getDay(), last_saturday)
    end_day.setDate(end_day.getDate() + last_saturday);


    console.log(
      this.getDateFormated(init_day),
      this.getDateFormated(today),
      this.getDateFormated(last_day),
      this.getDateFormated(end_day)
    );


    this.loading = true;
    this.$http.get('https://holidayapi.com/v1/holidays', {
        params: {
          key: '3da6bb9f-0788-489e-9795-17432560e47e',
          year: today.getFullYear(),
          country: 'US'
        }
      })
      .then(
        (res) => {
          this.holydays = res.body.holidays;
          console.log(this.holydays)
          this.loading = false;


          let month = null;
          let current_month = null;
          let cssClass = '';

          for (var d = new Date(init_day); d <= end_day; d.setDate(d.getDate() + 1)) {

            let uniqueMonth = this.getMonthFormated(d);

            if(month !== uniqueMonth) {
              if(month === null && this.getMonthFormated(init_day) != this.getMonthFormated(today)) {
                this.data.push({
                  month: this.getMonthFormated(today),
                  weeks: []
                });
              } else {
                this.data.push({
                  month: uniqueMonth,
                  weeks: []
                });
              }
              current_month = this.data[this.data.length - 1];
              month = uniqueMonth;
            } else {
              current_month = this.data.filter((item) => {
                return item.month === uniqueMonth
              })[0];
            }

            let holydaysResult = this.holydays.hasOwnProperty(this.getDateFormated(d));
            console.log(holydaysResult)

            let is_weekend = (d.getDay() === 0 || d.getDay() === 6);
            let is_invalid = (d < today || d > last_day);

            if (is_invalid) {
               cssClass = 'gray'
            } else if (holydaysResult) {
              cssClass = 'orange'
            } else if (is_weekend) {
              cssClass = 'yellow'
            } else (
              cssClass = 'green'
            )


            if (d.getDay() === 0 ) {
              current_month.weeks.push([]);
            }

            let current_week = current_month.weeks[current_month.weeks.length - 1]

            current_week.push({
              day: d.getDate(),
              is_invalid: is_invalid,
              class:cssClass
            });



          }

          console.log(this.data);

        },
        () => {
          this.loading = false;
        }
      )

  }
});