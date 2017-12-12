<template>
  <div id="app">

    <view-box>

      <x-header
        slot="header"
        title="网易新闻"
        
      >
        <div slot="overwrite-left" >直播</div>
        <div slot="right" @click="toblog">更多</div>
      </x-header>

      <scroller class="scroller" 
        :on-refresh="refresh" 
        :on-infinite="infinite"
        ref="myscroller"
      >
      <scroll style="height:44px;" :lock-y="true"  >
        <div style="width:600px">
          <tab class="tabchannel">
            <tab-item selected >
              js
            </tab-item>
            <tab-item>
              css
            </tab-item>
            <tab-item>
              vue
            </tab-item>
            <tab-item>
              vux
            </tab-item>
            <tab-item>
              react
            </tab-item>
            <tab-item>
              node
            </tab-item>
          </tab>
        </div>
      </scroll> 

      
        <swiper  
        :list="swiperdata" :auto = "true" :loop = "true" >

        </swiper>

        <marquee 
          :item-height ="35"
          :duration="500"
        style="margin-top:13px;" >
          <marquee-item v-for="item in marqueelist " :key="item.key" >
            {{item.digest}}
          </marquee-item>

        </marquee>
        
        <panel 
        header='热文列表' :list="datalist" :footer="listfooter" >

        </panel>
      </scroller>

      <tabbar class="bottomfix" slot="bottom">
        <tabbar-item selected>
          <i slot="icon" class="fa fa-binoculars" ></i>
          <span slot="label" >新闻</span>
        </tabbar-item>
        <tabbar-item>
          <i slot="icon" class="fa fa-video-camera" ></i>
          <span slot="label" >直播</span>
        </tabbar-item>
         <tabbar-item>
          <i slot="icon" class="fa fa-group" ></i>
          <span slot="label" >好友</span>
        </tabbar-item>
        <tabbar-item>
          <i slot="icon" class="fa fa-id-card-o" ></i>
          <span slot="label" >我的</span>
        </tabbar-item>
        <!-- <router-link to="https://blog.liufulin.online/" tag="tabbar-item">
          <i slot="icon" class="fa fa-id-card-o" ></i>
          <span slot="label" >我的</span>
        </router-link> -->
      </tabbar>

    </view-box>

    <router-view/>
  </div>
</template>

<script>

import {  ViewBox,
        XHeader,
        Tabbar, 
        TabbarItem ,
        Tab, 
        TabItem,
        Scroller as Scroll,
        Swiper,
        Marquee, 
        MarqueeItem,
        Panel 
        } from 'vux';
const freshcode = ['A', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B010'];
var startindex = 0;
var endindex = 9;

var codeindex=0;
var isinit = false;
var getcode = function(){ 
  codeindex %= freshcode.length;  
  let code = freshcode[codeindex];
  codeindex ++;
  return code
}
export default {
  name: 'app',
  created(){
    this.$jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html')
    .then( data =>{
      // console.log(data);
      
      //swiper数据
      this.swiperdata = data.focus.filter( item =>{
        return item.addata === null&&item.picInfo[0];
      } ).map( item=>{
        return {
          img: item.picInfo[0].url,
          url: 'https://blog.liufulin.online/',
          title: item.title
        }
      } )
      //热文列表数据
      this.datalist = data.list.filter( item =>{
        return item.addata === null&&item.picInfo[0];
      } ).map( item=>{
        return {
          src: item.picInfo[0].url,
          fallbackSrc: 'https://blog.liufulin.online/img/avatar.jpg',
          url: item.link,
          title: item.title,
          desc: item.digest
        }
      } )
      //跑马灯数据
      this.marqueelist = data.news.filter( item =>{
        return item.addata === null;
      } ).map( item =>{
        return {
          digest: item.digest.substr(0,document.body.clientWidth/17),
          key: item.docid
        }
      } )
      isinit = true;
// console.log(document.body.clientWidth);
    } )
  },
  methods:{
    toblog(){
      // console.log(123)
      // this.$router.history.push({path:'https://blog.liufulin.online/'});
    },
    refresh(done){
      
      this.$jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html',{
        miss:'00',
        refresh: getcode()
      }).then( data=>{
        getcode();
        this.datalist = data.list.filter( item =>{
            return item.addata === null&&item.picInfo[0];
          } ).map( item=>{
            return {
              src: item.picInfo[0].url,
              fallbackSrc: 'https://blog.liufulin.online/img/avatar.jpg',
              url: item.link,
              title: item.title,
              desc: item.digest
            }
          } )
          this.$refs.myscroller.finishPullToRefresh();
          // done();
          // console.log( this.$refs.resize)
          this.$vux.toast.show('拉取成功！')
      } )
      
    },
    infinite(done){
      // console.log(222)
      if(!isinit){
        // done();
        this.$refs.myscroller.finishInfinite();
        return
      }
      // console.log(111)
      setTimeout(()=>{
        this.$jsonp(`http://3g.163.com/touch/jsonp/sy/recommend/${startindex}-${endindex}.html`, {
                miss: '00',
                refresh: getcode()
            }).then(data=>{
              var newlist = data.list.filter( item =>{
                return item.addata === null&&item.picInfo[0];
              } ).map( item=>{
                return {
                  src: item.picInfo[0].url,
                  fallbackSrc: 'https://blog.liufulin.online/img/avatar.jpg',
                  url: item.link,
                  title: item.title,
                  desc: item.digest
                }
              } )
              this.datalist = this.datalist.concat(newlist)
              // done();
              this.$refs.myscroller.finishInfinite();
              startindex+=10;
              endindex+=10;

            })
      },1000)
    }
  },
  data(){
    
    return {
        swiperdata:[/* {
          url: 'javascript:',
          img: 'https://static.vux.li/demo/1.jpg',
          title: '送你一朵fua'
        }, {
          url: 'javascript:',
          img: 'https://static.vux.li/demo/2.jpg',
          title: '送你一辆车'
        }, {
          url: 'javascript:',
          img: 'https://static.vux.li/demo/3.jpg',
          title: '送你一次旅行',
          fallbackImg: 'https://static.vux.li/demo/3.jpg'
        } */],
        marqueelist:[],
        datalist: [],
        listfooter: {
          title: "查看更多热文",
          url: "https://blog.liufulin.online"
        }
    }
  },
  components:{
    ViewBox,
    XHeader,
    Tabbar, 
    TabbarItem,
    Tab, 
    TabItem,
    Scroll,
    Swiper,
    Marquee, 
    MarqueeItem,
    Panel 
  }
}
</script>

<style lang="less" >

@import '~vux/src/styles/reset.less';

html,body{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
  height: 100%;
  .vux-header{
    z-index: 99;
    position: absolute;
    width: 100%;
    top: 0;
    background: #0e2b79;
  }
  #vux_view_box_body{
    // padding-top: 46px;
    .weui-media-box__thumb{
      height: 76%;
      margin-top: 12%;
    }
  }
  .tabchannel{
    z-index: 999;
  }
  .scroller{
    box-sizing: border-box;
    padding-top: 46px;
    padding-bottom: 70px;
  }
  .vux-marquee-box li{
    padding-left: 20px;
    font-size: 16px;
    height:35px;
  }

  .loading-layer{
    padding-bottom: 30px;
  }
  .bottomfix{
    position: absolute;
    left: 0;
    bottom:0;
  }
}

</style>
