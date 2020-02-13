import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import * as $ from "jquery";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private as: AppService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.query = params.get("id");
      while (1) {
        if (this.query.includes("+")) this.query = this.query.replace("+", " ");
        else break;
      }
      this.query1 = this.query;
      this.query = this.query.replace(/ /g, "+");
      // console.log(this.query);
    });
    this.contentSet();

    $(".navbarSearch").click(function(e) {
      e.stopPropagation(); //stops click event from reaching document
    });
    $(document).click(function() {
      $(".navbarSearch").animate(
        {
          width: "30%"
        },
        200
      );
      $("input.lead").css("color", "white");
    });
  }
  newsSearchContent;
  query;
  query1;
  goBack() {
    window.history.back();
  }
  contentImgUrls = [];
  contentTitles = [];
  contentUrls = [];
  flag = 0;
  contentSet() {
    this.flag = 0;
    var queryObject = {
      input: this.query
    };
    this.http
      .post(
        "https://websight-backend.herokuapp.com/news/gnews-search",
        queryObject
      )
      .subscribe(
        response => {
          // console.log(response);
          // let url = "/news/search/" + this.query;
          this.newsSearchContent = response;
          this.contentTitles = this.newsSearchContent.titles;
          this.contentImgUrls = this.newsSearchContent.imgUrl;
          this.contentUrls = this.newsSearchContent.urls;
          this.flag = 1;
          // this.router.navigateByUrl(url);
        },
        error => {
          console.log("error", error);
        }
      );
  }
  newsOpen(i) {
    var win = window.open(this.contentUrls[i], "_blank");
    win.focus();
  }
  newsQuery;
  passNewsQuery() {
    this.query = this.query1 = this.newsQuery;
    let newsq = this.query.replace(/ /g, "+");
    let url = "/news/search/" + newsq;
    $("#search").blur();
    this.router.navigateByUrl(url);
    this.contentSet();
    this.newsQuery = "";
    $(".navbarSearch").animate(
      {
        width: "30%"
      },
      200
    );
    $("input.lead").css("color", "white");
  }
  searchClick() {
    $(".navbarSearch").animate(
      {
        width: "100%"
      },
      300
    );
    $("input.lead").css("color", "black");
  }
}