{
  let view={
      el: '.page > main',
      init(){
        this.$el = $(this.el)
      },
      template:`
      <form class="form">
          <div class="row">
              <label>
              歌曲
              </label>
              <input name="name" type="text" value="__name__">
          </div>
          <div class="row">
              <label>
              歌手
              </label>
              <input name="singer" type="text" value="__singer__">
          </div>
          <div class="row">
              <label>
              外链
              </label>
              <input name="url" type="text" value="__url__">
          </div>
          <div class="row">
              <button type="submit">保存</button>
          </div>
      </form>
      ` ,
      render(data){
          if(data === undefined){
            data = {}
          }
            let placeholders = ['name', 'url', 'singer', 'id']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
      },
      reset(){
          this.render({})
      }
  }
  let model = {
      data: {
        name: '', singer: '', url: '', id: ''
      },
      create(data){
          // 声明类型
        var Song = AV.Object.extend('Song');
        // 新建对象
        var song = new Song();
        // 设置名称
        song.set('name',data.name)
        song.set('singer',data.singer)
        song.set('url',data.url)
        song.set('id',data.id)
        // 设置优先级
        return song.save().then((newSong)=> {
            let id = newSong.id
            let attributes = newSong.attributes
            Object.assign(this.data, { //assign 是浅拷贝 此处可以改为{this.data ={id, ...attributes}}
                id: id,                //或者按照下面传数据处修改   修改一处即可完成深拷贝
                name: attributes.name,
                singer: attributes.singer,
                url: attributes.url
            })
            //把右边的对象赋给左边的对象
            //等价于
            //this.data.id = id
            //this.data.name = attributes.name
            //this.data.singer=attributes.singer
            //this.data.url =attributes.url

            /////其中ES6语法可以简写为
            // Object.assign(this.data, {
            //   id,
            //   ...attributes//将attributes中的所有属性都赋值给左边对象
            // })
            
        }, function (error) {
            console.error(error);
        })
      }
  }
  let controller = {
      init(view,model){
          this.view = view
          this.view.init()
          this.model=model
          this.view.render(this.model.data)
          this.bindEvents()
          window.eventHub.on('upload', (data)=>{
            this.model.data = data
            this.view.render(this.model.data)
          })
          window.eventHub.on('select', (data)=>{
              this.model.data = data
              this.view.render(this.model.data)
          })
          window.eventHub.on('new',()=>{
                this.model.data ={
                    name: '', singer: '', url: '', id: ''
            }
                this.view.render(this.model.data)
          })
      },
      bindEvents(){
          this.view.$el.on('submit', 'form', (e)=>{
            e.preventDefault()
            let needs = ['name', 'singer', 'url']//可以改写为 let needs='name singer url'.split(' ')//以空格隔开 形成新的对象（数组）
            let data = {}
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()//val()函数 找到对应的value
            })
            this.model.create(data).then(()=>{
                this.view.reset()
                let string = JSON.stringify(this.model.data)
                let object= JSON.parse(string)
                window.eventHub.emit('create', object)
            })
          })                                        
      }
  }
  controller.init(view,model)
}