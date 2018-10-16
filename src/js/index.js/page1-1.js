{   
    let view = {
      el: '.page tabs-navbar',
      init(){
         this.$el = $(this.view)
      }
    }
    let model = {}
    let controller = {
      init(){
        this.view = view
        this.view.init()
        this.model = model
      },
     }
}