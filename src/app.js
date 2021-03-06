import './common.css'
import './index.css'

import goodsJsonData from './json/goods.json'
import recommendData from './json/recommend.json'

// DOM动态创建家电、智能、搭配、配件、周边
((data) => {
  // 原生DOM操作创建
  const idArr = Object.keys(data)
  for (let z = 0; z < idArr.length; z++) {
    const id = idArr[z]
    const [tabData, leftData, rightData] = [data[id].tabData, data[id].leftData, data[id].rightData]
    const ulLength = rightData.length
    let leftContent = ''
    let leftContentArr = []
    let rightContent = ''
    let rightContentArr = []
    let parentNode = document.getElementById(id)

    // tabArea
    let tabContentArr = []
    tabContentArr.push('<ul>')
    for (let i = 0; i < tabData.length; i++) {
      if (i === 0) {
        tabContentArr.push('<li class="tab-active">' + tabData[0] + '</li>')
      } else {
        tabContentArr.push('<li>' + tabData[i] + '</li>')
      }
    }
    tabContentArr.push('</ul>')
    let tabInnerHtml = tabContentArr.join('')
    let tabArea = parentNode.getElementsByClassName('tab-area')
    tabArea[0].innerHTML = tabInnerHtml

    // leftData
    leftContentArr.push('<ul class="goods-list">')
    for (let i = 0; i < leftData.length; i++) {
      if (leftData[i].size === 'l') {
        leftContentArr.push('<li class="goods-item goods-item-l">')
      } else {
        leftContentArr.push('<li class="goods-item goods-item-m">')
      }
      leftContentArr.push('<a><img src="' + leftData[i].imgSrc + '" alt=""></a>')
      leftContentArr.push('</li>')
    }
    leftContentArr.push('</ul>')
    leftContent = leftContentArr.join('')

    // rightData
    for (let i = 0; i < ulLength; i++) {
      let ul = []
      if (i !== 0) {
        ul.push('<ul class="goods-list hide">')
      } else {
        ul.push('<ul class="goods-list">')
      }
      const liLength = rightData[i].length
      let liArr = []
      for (let j = 0; j < liLength; j++) {
        let li = []
        const dataItem = rightData[i][j]
        if (dataItem.size === 'm') {
          li.push('<li class="goods-item goods-item-m">')
        } else {
          li.push('<li class="goods-item goods-item-s">')
        }
        if (!dataItem.lastItem) {
          if (dataItem.flag) {
            li.push('<div class="flag ' + dataItem.flag.class + '">' + dataItem.flag.text + '</div>')
          }
          li.push('<div class="goods-img"><a><img src="' + dataItem.imgSrc + '" alt=""></a></div>')
          li.push('<h3 class="title"><a>' + dataItem.title + '</a></h3>')
          li.push('<p class="desc">' + dataItem.desc + '</p>')
          let price = '<p class="price"><span>' + dataItem.price + '</span>'
          if (dataItem.delPrice) {
            price = price + '<del><span>' + dataItem.delPrice + '</span></del>'
          }
          price += '</p>'
          li.push(price)

          if (dataItem.review || dataItem.author) {
            let reviewWrapper = []
            reviewWrapper.push('<div class="review-wrapper"><a>')
            reviewWrapper.push('<span class="review">' + dataItem.review + '</span>')
            reviewWrapper.push('<span class="author">' + dataItem.author + '</span>')
            reviewWrapper.push('</a></div>')
            li.push(reviewWrapper.join(''))
          }
        } else {
          li.push('<div class="goods-more"><a><i class="iconfont">&#xe615;</i></a></div>')
          li.push('<a class="more">')
          li.push('<span>浏览更多</span>')
          li.push('<small>' + dataItem.lastItemText + '</small>')
          li.push('</a>')
          li.push('</li>')
        }
        liArr.push(li.join(''))
      }
      ul.push(liArr.join(''))
      ul.push('</ul>')
      rightContentArr.push(ul.join(''))
    }
    rightContent = rightContentArr.join('')
    let boxContentInnerHTML = '<div class="row"><div class="span4">' + leftContent + '</div><div class="span16">' + rightContent + '</div></div>'
    let boxContent = parentNode.getElementsByClassName('box-content')[0]
    boxContent.innerHTML = boxContentInnerHTML
  }

})(goodsJsonData);

// 动态创建"为你推荐"DOM内容
((data) => {
  let recommendArr = []
  recommendArr.push('<div class="carousel-wrapper">')
  recommendArr.push('<ul class="carousel-list">')
  for (let i = 0; i < data.length; i++) {
    recommendArr.push('<li class="carousel-item">')
    recommendArr.push('<a class="goods-link"><img src="' + data[i].imgSrc + '" alt="" /></a>')
    recommendArr.push('<h3 class="title"><a>' + data[i].title + '</a></h3>')
    recommendArr.push('<p class="price">' + data[i].price + '</p>')
    recommendArr.push('<p class="desc">' + data[i].desc + '</p>')
    recommendArr.push('</li>')
  }
  recommendArr.push('</ul>')
  recommendArr.push('</div>')
  let recommendInnerHtml = recommendArr.join('')
  let recommend = document.getElementById('recommend')
  let recommendBoxContent = recommend.getElementsByClassName('box-content')
  if (recommendBoxContent.length) {
    recommendBoxContent[0].innerHTML = recommendInnerHtml
  }

})(recommendData);

$(document).ready(function() {
  // topbar 购物车
  $('#topbar-cart').hover(function() {
    $(this).addClass('topbar-cart-active').find('.cart-menu').slideDown(200)
  }, function() {
    $(this).removeClass('topbar-cart-active').find('.cart-menu').slideUp(200)
  })

  // header 导航二级菜单
  $('#header-nav .nav-item').hover(function() {
    $(this).find('.header-nav-menu').show().addClass('header-nav-menu-active').find('ul').show()
  }, function() {
    $(this).find('.header-nav-menu').removeClass('header-nav-menu-active').hide().find('ul').hide()
  })

  // header category 商品导航
  $('#header .category-item').hover(function() {
    $(this).find('.category-detail').show()
  }, function() {
    $(this).find('.category-detail').hide()
  })

  // header 搜索框
  $('#header-search .search-text').focus(function() {
    $(this).css('border-color', '#ff6700').next().css('border-color', '#ff6700').next().fadeOut(200).next().slideDown(200)
  }).blur(function() {
    $(this).css('border-color', '#e0e0e0').next().css('border-color', '#e0e0e0').next().fadeIn(200).next().slideUp(200)
  })

  // home-container 轮播图, 定时器
  let carouselTimer = setInterval(function() {
    const $homeGoodsSlider = $('#home-goods-slider')
    const $slideItems = $homeGoodsSlider.find('.carousel-viewport .slide-item')
    const $pagerItems = $homeGoodsSlider.find('.carousel-controls-pager .pager-item')
    const activatedIndex = $homeGoodsSlider.find('.carousel-viewport .slide-item-active').index()
    let nextIndex = 0
    if (activatedIndex >= ($slideItems.length - 1)) {
      nextIndex = 0
    } else {
      nextIndex = activatedIndex + 1
    }
    $slideItems.removeClass('slide-item-active').hide().eq(nextIndex).addClass('slide-item-active').fadeIn(1000)
    $pagerItems.removeClass('pager-item-active').eq(nextIndex).addClass('pager-item-active')
  }, 3000)

  // home-container 轮播图, 左右箭头点击事件
  $('#home-goods-slider .carousel-controls-direction').on('click', 'a', function(event) {
    clearInterval(carouselTimer)
    const direction = $(this).data('direction')
    const $homeGoodsSlider = $(this).parents('#home-goods-slider')
    const $slideItems = $homeGoodsSlider.find('.carousel-viewport .slide-item')
    const $activatedItem = $homeGoodsSlider.find('.carousel-viewport .slide-item-active')
    let $siblingItem = undefined
    if (direction === 'prev') {
      $siblingItem = $activatedItem.prev('.slide-item')
      if ($siblingItem.length === 0) {
        $siblingItem = $slideItems.eq($slideItems.length - 1)
      }
    } else {
      $siblingItem = $activatedItem.next('.slide-item')
      if ($siblingItem.length === 0) {
        $siblingItem = $slideItems.eq(0)
      }
    }
    $activatedItem.removeClass('slide-item-active').hide()
    $siblingItem.addClass('slide-item-active').fadeIn(1000)
    $homeGoodsSlider.find('.carousel-controls-pager .pager-item').removeClass('pager-item-active').eq($siblingItem.index()).addClass('pager-item-active')
  })

  // home-container 轮播图, 小圆点点击事件
  $('#home-goods-slider .carousel-controls-pager').on('click', 'a', function(event) {
    if (!$(this).hasClass('pager-item-active')) {
      clearInterval(carouselTimer)
      let index = $(this).data('index')
      $(this).parents('.carousel-controls-pager').find('.pager-item').removeClass('pager-item-active').eq(index).addClass('pager-item-active')
      $(this).parents('.home-goods-slider').find('.carousel-viewport .slide-item').removeClass('slide-item-active').hide().eq(index).addClass('slide-item-active').fadeIn(1000)
    }
  })

  // home-container 明星单品 轮播图 定时器
  let startGoodsTimerFn = function() {
    const $startGoods = $('#home-star-goods')
    const $startGoodsDirection = $startGoods.find('.carousel-controls-direction')
    const direction = $startGoodsDirection.find('.disabled').data('direction')
    $startGoodsDirection.find('.disabled').removeClass('disabled').siblings('a').addClass('disabled')
    if (direction === 'prev') {
      $startGoods.find('.carousel-list').css('margin-left', '0px')
    } else {
      $startGoods.find('.carousel-list').css('margin-left', '-1240px')
    }
  }
  let startGoodsTimer = setInterval(startGoodsTimerFn, 4000)

  $('#home-star-goods .carousel-controls-direction').hover(function() {
    clearInterval(startGoodsTimer)
  }, function() {
    startGoodsTimer = setInterval(startGoodsTimerFn, 4000)
  })

  // home-container 明星单品 轮播图
  $('#home-star-goods .carousel-controls-direction').on('click', 'a', function() {
    const direction = $(this).data('direction')
    if (!$(this).hasClass('disabled')) {
      const $homeStarGoods = $(this).parents('#home-star-goods')
      $(this).addClass('disabled').siblings('a').removeClass('disabled')
      if (direction === 'prev') {
        $homeStarGoods.find('.carousel-list').css('margin-left', '0px')
      } else {
        $homeStarGoods.find('.carousel-list').css('margin-left', '-1240px')
      }
    }
  })

  // page-main区域商品tab切换
  $('.tab-area li').mouseover(function() {
    $(this).addClass('tab-active').siblings('li').removeClass('tab-active')
    const index = $(this).index()
    $(this).parents('.box-header').next().find('.span16 ul').eq(index).show().siblings('ul').hide()
  })

  // recommend 为你推荐 轮播图
  $('#recommend .carousel-controls-direction').on('click', 'a', function() {
    const direction = $(this).data('direction')
    if (!$(this).hasClass('disabled')) {
      const $recommend = $(this).parents('#recommend')
      const $carouselList = $recommend.find('.carousel-list')
      const total = $carouselList.find('li').length
      const offset = parseInt($carouselList.width() / total) * 5
      const limit = -($carouselList.width() - offset)
      const oldMarginLeft = parseInt($carouselList.get(0).style.marginLeft || 0)

      if (direction === 'prev') {
        if (oldMarginLeft < 0) {
          let newMarginLeft = oldMarginLeft + offset
          $carouselList.css('margin-left', newMarginLeft + 'px')
          if (newMarginLeft === 0) {
            $(this).addClass('disabled').siblings('a').removeClass('disabled')
          }
        }
      } else {
        if (oldMarginLeft <= 0 && oldMarginLeft > limit) {
          let newMarginLeft = oldMarginLeft - offset
          $carouselList.css('margin-left', newMarginLeft + 'px')
          if (newMarginLeft === limit) {
            $(this).addClass('disabled').siblings('a').removeClass('disabled')
          }
        }
      }
    }
  })

  // page-main content卡片内容轮播图，左右箭头点击事件
  $('#content .content-carousel-control').on('click', 'a', function(event) {
    const isLeft = event.target.className.indexOf('left') !== -1 ? true : false
    const $contentItem = $(this).parents('.content-item')
    const $pagers = $contentItem.find('.content-pagers-wrapper .pagers')
    const $activeLi = $pagers.find('li.pager-active')
    const index = $activeLi.index()
    const length = $pagers.children('li').length
    const $contentItemList = $contentItem.find('ul.content-item-list')
    const width = 296
    if (length < 1) {
      return
    }
    if (isLeft) {
      if (index > 0 && index < length) {
        const oldLeft = parseInt($contentItemList.get(0).style.left || 0)
        $contentItemList.css('left', oldLeft + width + 'px')
        $activeLi.removeClass('pager-active').prev().addClass('pager-active')
      }
    } else {
      if (index < length - 1) {
        const oldLeft = parseInt($contentItemList.get(0).style.left || 0)
        $contentItemList.css('left', oldLeft - width + 'px')
        $activeLi.removeClass('pager-active').next().addClass('pager-active')
      }
    }
  })

  // page-main content卡片内容轮播图，小圆点点击事件
  $('#content .content-pagers-wrapper .pagers').on('click', 'span', function() {
    const $targetLi = $(this).parent()
    if (!$targetLi.hasClass('pager-active')) {
      const num = parseInt($(this).text()) - 1
      const $contentItem = $(this).parents('.content-item')
      const $contentItemList = $contentItem.find('ul.content-item-list')
      const width = 296
      $contentItemList.css('left', (-width * num) + 'px')
      $targetLi.addClass('pager-active').siblings().removeClass('pager-active')
    }
  })

})
