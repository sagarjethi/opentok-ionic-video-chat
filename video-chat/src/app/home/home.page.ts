import { Component, OnInit } from '@angular/core';
import * as OT from '@opentok/client';
import { fabric } from 'fabric';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fabricCanvas: any;
  session: any;
  apiKey: any;
  sessionId: any;
  token: any;

  constructor() { }
  ngOnInit() {
    this.apiKey = "46667812";
    this.sessionId = "1_MX40NjY2NzgxMn5-MTU4NjU1MzE5ODc1N35sS05BalBxVlRQM2dISDRlanFodG9VK0R-UH4";
    this.token = "T1==cGFydG5lcl9pZD00NjY2NzgxMiZzaWc9MDZjNzA3ZmMyNDE3NzM5YmUyMmRhY2Y3MzY0YWI2Mjg1NWYxNWUwNDpzZXNzaW9uX2lkPTFfTVg0ME5qWTJOemd4TW41LU1UVTROalUxTXpFNU9EYzFOMzVzUzA1QmFsQnhWbFJRTTJkSVNEUmxhbkZvZEc5VkswUi1VSDQmY3JlYXRlX3RpbWU9MTU4NjU1MzIyOSZub25jZT0wLjE3MDM3MjM0NjQxNDgzNDEyJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1ODY2Mzk2MjgmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
    this.initializeOTSession();
    this.fabricCanvas = new fabric.Canvas('WhiteboardCanvas');
    this.fabricCanvas.isDrawingMode = true;
    this.fabricCanvas.freeDrawingBrush.width = 3;
    this.fabricCanvas.freeDrawingBrush.color = "red";

  }
  initializeOTSession() {
    this.session = OT.initSession(this.apiKey, this.sessionId);
    this.startSession(this.session);

  }
  startSession(session: any) {

    session.connect(this.token, (error: any) => {

      if (error) {
        if (error.name === "OT_NOT_CONNECTED") {
          console.log("You are not connected to the internet. Check your network connection.", 'danger');
        }
        console.log("Error in connecting OT", error);
      }
      else {
        this.initializePublisher(session);
      }
    });
    session.on('streamCreated', function (event) {
      var subscriberProperties = { insertMode: "append",
      width: "400px",
      height: "400px",
      style: {
                buttonDisplayMode: "on",
                audioLevelDisplayMode: "on"
      }};
      var subscriber = session.subscribe(event.stream,
        'subscriberContainer',
        subscriberProperties,
        function (error) {
          if (error) {
            console.log(error);
          } else {
            console.log('Subscriber added.');
          }
        });
    });

  }
  initializePublisher(session) {
    interface CanvasElement extends HTMLCanvasElement {
      captureStream(Rate): MediaStream;
    };
    
    const canvas = <CanvasElement>document.getElementById("WhiteboardCanvas");
    let publisherOptions = {
      publishAudio: true,
      publishVideo: true,
      name: "videoCam",
      width: "350px",
      height: "350px"         
   };
  
    var publisher = OT.initPublisher("publisherElement", publisherOptions, (error) => {
      if (error) {
        console.log("Webcam Publisher ERROR.", error);
     
      } else {
        console.log("Webcam Publisher initialized.");
       }
    }
    );

    session.publish(publisher, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Publishing a stream - success.');
      }
    });

  }

}
