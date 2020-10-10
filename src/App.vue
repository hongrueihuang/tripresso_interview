<template>
<div id="app">
    <button class="btn-gotop btn btn-info" @click="goTop"><i class="fas fa-arrow-up fa-2x"></i></button>
    <section class="banner mb-2">
        <div class="container">
            <div class="bg-cover banner-image" style="background-image: url(https://cdn.pixabay.com/photo/2018/04/16/16/16/sunset-3325080__340.jpg)"></div>
        </div>
    </section>
    <section class="content">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <!-- Sort Button -->
                    <div class="w-100 bg-white btn-group mb-2">
                        <button type="button" class="btn btn-outline-secondary sort-btn" :class="{'active': sort === 'rating'}" @click="sort = 'rating',rotate = !rotate,updateList()">
                            精選評分
                            <i class="fas fa-caret-up ml-2" v-if="sort === 'rating'" :class="{'reverse': rotate}"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary sort-btn" :class="{'active': sort === 'price'}" @click="sort = 'price',rotate = !rotate,updateList()">
                            價格<i class="fas fa-caret-up ml-2" v-if="sort === 'price'" :class="{'reverse': rotate}"></i>
                        </button>
                    </div>
                    <!-- Sort Way -->
                    <div class="d-flex justify-content-between">
                        <div>排序方式 : <span class="text-highlight font-weight-bold">{{showSortWay}}</span></div>
                        <div>第<span class="text-highlight font-weight-bold"> {{ showPage }} </span>頁</div>
                    </div>
                    <div class="card w-100 my-2" v-for="item in data" :key="item.id">
                        <div class="row no-gutters">
                            <div class="col-4 card-image-parent">
                                <!-- Tour Image -->
                                <div class="w-100 card-image bg-cover" :style="`background-image: url(${item.image_url});height:100%;`"></div>
                            </div>
                            <div class="col-8 p-3">
                                <div class="w-100 d-flex justify-content-between">
                                    <!-- Agency Rating -->
                                    <small class="text-secondary">{{ item.agency }}
                                        <i class="fas fa-star text-warning" v-for="num in item.rating" :key="num+1"></i>
                                        <i class="fas fa-star text-secondary" v-for="num in (5-item.rating)" :key="num-1"></i>
                                    </small>
                                    <button class="btn-favorite"><i class="far fa-heart"></i></button>
                                </div>
                                <!-- Tour Title -->
                                <h5 class="tour-title text-left my-2 text-nowrap text-truncate" :title="item.title">
                                    <a :href="item.tour_detail_url" target="_blank">{{ item.title }}</a>
                                </h5>
                                <!-- Tag -->
                                <div class="tag d-flex flex-nowrap">
                                    <span class="badge badge-primary mx-1" v-for="(tag, i) in item.tags" :key="i">{{ tag }}</span>
                                </div>
                                <hr>
                                <div class="row no-gutters align-items-center justify-content-between">
                                    <!-- Groups -->
                                    <div class="col-6 groups">
                                        <a :href="item.tour_detail_url" class="groups-item mx-1" v-for="group in item.group" :key="group.id" target="_blank">
                                            <span>{{ group.date | formatTime }}</span>
                                            <span class="groups-item-quantity">可售{{ group.quantity }}位</span>
                                        </a>
                                    </div>
                                    <div class="col-2">
                                        <button class="btn btn-outline-primary" @click="openModal(item)" v-if="item.group.length > 4">更多日期</button>
                                    </div>
                                    <!-- Tour Day Price -->
                                    <div class="col-4 duringPrice">
                                        <span class="text-highlight highlight">{{ item.tour_days }}</span>天
                                        <span class="text-highlight highlight">{{ item.min_price }}</span>元起
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav aria-label="Page navigation">
                        <ul class="pagination justify-content-center my-5 pagination-lg">
                            <li class="page-item" :class="{'disabled' : currentPage === 1}">
                                <a class="page-link" href="#" aria-label="Previous" @click.prevent="currentPage-=1, updateList(),goTop()">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li class="page-item" v-for="page in 10" :key="page" :class="{'active' : currentPage === page}">
                                <a class="page-link" href="#" @click.prevent="currentPage = page, updateList(),goTop()">{{ page }}</a>
                            </li>
                            <li class="page-item" :class="{'disabled' : currentPage === 10}">
                                <a class="page-link" href="#" aria-label="Next" @click.prevent="currentPage+=1, updateList(),goTop()">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <div class="modal fade" id="dateModal" tabindex="-1" aria-labelledby="dateModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark">
                    <h5 class="modal-title text-white" id="dateModalLabel">所有日期</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul class="row list-unstyled flex-wrap alldate">
                        <li class="col-3" v-for="tempgroup in tempdata.group" :key="tempgroup.id">
                            <a :href="tempdata.tour_detail_url" class="btn btn-primary" target="_blank">
                                <span>{{ tempgroup.date | formatTime }}</span>
                                <span>可售{{ tempgroup.quantity }}位</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="modal-footer justify-content-center p-0 border-0">
                    <button type="button" class="btn btn-secondary btn-block m-0 rounded-0 btn-lg" data-dismiss="modal">繼續逛逛</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import $ from 'jquery';
export default {
    name: 'App',
    data() {
        return {
            data: [],
            sort: 'rating',
            rotate: true,
            currentPage: 1,
            tempdata: {}
        }
    },
    computed: {
        showSortWay() {
            const vm = this;
            let sortVal;
            let highLow;
            let sortway;
            switch (vm.sort) {
                case 'rating':
                    sortVal = '評分';
                    break;
                case 'price':
                    sortVal = '價格';
                    break;
            }
            if (vm.rotate) {
                highLow = '由高至低'
            } else {
                highLow = '由低至高'
            }
            sortway = `${sortVal} ${highLow}`
            return sortway
        },
        showPage() {
            return this.currentPage
        }
    },
    methods: {
        updateList() {
            const vm = this;
            let direction;
            switch (vm.rotate) {
                case true:
                    direction = `desc`;
                    break;
                case false:
                    direction = 'asc';
            }
            let sortValue = `${vm.sort}_${direction}`;
            let api = `${process.env.VUE_APP_APIPATH}?page=${vm.currentPage}&row_per_page=10&sort=${sortValue}`;
            vm.$http.get(api).then((response) => {
                console.log(response.data)
                vm.data = response.data.data.tour_list
            })
        },
        openModal(item) {
            $('#dateModal').modal('show');
            console.log(item)
            this.tempdata = item;
        },
        goTop() {
            $('html,body').animate({
                scrollTop: 0,
            }, 500)
        }
    },
    created() {
        this.updateList();
    }
}
</script>

<style lang="scss">
@import './assets/all.scss';

body {
    background-color: $light;
}

#app {
    font-family: Avenir, "Microsoft JhengHei", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
