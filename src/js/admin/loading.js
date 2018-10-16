{
    let view={
        el: '#siteLoading',
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }
    }
    let controller={
        init(){
            this.view=view
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('beforeUpload',()=>{
                this.view.show()
            })
            window.eventHub.on('afterUpload',()=>{
                this.view.hide()
            })
        }
    }
    controller.init(view)
}