import { Component, Renderer, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'score-editor',
  templateUrl: './score.editor.html',
  styleUrls: ['./score.editor.css']
})
export class ScoreEditor implements AfterViewInit {
    context:CanvasRenderingContext2D;
    canvas;
    canvasDiv;
    constructor(private elRef:ElementRef) {}

    ngAfterViewInit() {
        this.canvas = this.elRef.nativeElement.querySelector('#scoreEditorCanvas');
        this.canvasDiv = this.elRef.nativeElement.querySelector('#canvasDiv');

        this.context = this.canvas.getContext("2d");
        this.draw();
    }

    draw() {
        this.canvas.width = this.canvasDiv.width;
        this.canvas.height = this.canvasDiv.height;
        requestAnimationFrame(() => {
            this.draw();
        })
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.fillStyle = '#0000FF';
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
    }
}