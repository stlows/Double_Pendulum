$(document).ready(function(){
    
    var g,trail1Length, trail2Length, m1, m2, r1, r2;
	
	var apply = function(){
		g = parseFloat($("#g_input").val());
		m1 = parseFloat($("#m1_input").val());
		m2 = parseFloat($("#m2_input").val());
		r1 = parseFloat($("#r1_input").val());
		r2 = parseFloat($("#r2_input").val());
		trail1Length = parseFloat($("#trail1_length").val());
		trail2Length = parseFloat($("#trail2_length").val());	
	}
		
	var fps, w1, w2, acc1, acc2, x0, y0, a1, a2;
	var init = function(){
		fps = 60;
		w1 = 0;
		w2 = 0;
		acc1 = 0;
		acc2 = 0;
		x0 = $("#canvas").width() / 2;
		y0 = 150;
		a1 = parseFloat($("#a1_input").val());
		a2 = parseFloat($("#a2_input").val());
	}
    
	var x1, x2, y1, y2;

	var findCoord = function(){
		x1 = x0 + r1 * Math.sin(a1);
        y1 = y0 + r1 * Math.cos(a1);
        x2 = x1 + r2 * Math.sin(a2);
        y2 = y1 + r2 * Math.cos(a2);
	}
	var updateValues = function(){
		var num = -g*(2*m1+m2)*Math.sin(a1) - m2*g*Math.sin(a1-2*a2) - 2*Math.sin(a1-a2)*m2*Math.pow(w2,2)*r2+Math.pow(w1,2)*r1*Math.cos(a1-a2);
        var den = r1*(2*m1+ m2-m2*Math.cos(2*a1-2*a2));
        acc1 = num/den;
        acc2=(2*Math.sin(a1-a2)*(Math.pow(w1, 2)*r1*(m1+m2)+g*(m1+m2)*Math.cos(a1)+Math.pow(w2, 2)*r2*m2*Math.cos(a1-a2)))/(r2*(2*m1+m2-m2*Math.cos(2*a1-2*a2)));

		w1 += acc1;
        w2 += acc2;
        a1 += w1;
        a2 += w2;
	}
    var draw = function(){
		
		findCoord();      
        draw_lines();
        draw_mass();
		updateValues();
    
		var count = parseInt($("#counter").text())
		$("#counter").text(count + 1)
    }
    
    var draw_lines = function(){
        $("#line1").attr("x1", x0);
        $("#line1").attr("y1", y0);    
        $("#line1").attr("x2", x1);
        $("#line1").attr("y2", y1);
        
        $("#line2").attr("x1", x1);
        $("#line2").attr("y1", y1);
        $("#line2").attr("x2", x2);
        $("#line2").attr("y2", y2);
		
		if($("#trail2_chkBox").prop("checked")){
			var current2 = $("#path2").attr("points");
			$("#path2").attr("points", current2.split(" ").splice(-trail2Length).join(" ") + " " + x2 + "," + y2);
		}else{
			$("#path2").attr("points","");
		}
		if($("#trail1_chkBox").prop("checked")){
			var current1 = $("#path1").attr("points");
			$("#path1").attr("points", current1.split(" ").splice(-trail1Length).join(" ") + " " + x1 + "," + y1);
		}else{
			$("#path1").attr("points","");
		}
    }
    var draw_mass = function(){
        $("#origin").attr("cx", x0);
        $("#origin").attr("cy", y0);
        
        $("#m1").attr("cx", x1);
        $("#m1").attr("cy", y1);
        
        $("#m2").attr("cx", x2);
        $("#m2").attr("cy", y2);
        
		// $("#m2Label").attr("x",x2 - 2);
		// $("#m2Label").attr("y",y2+3);
    }
	var start = function() {
		drawId = setInterval(draw, 1000 / fps);
		$("#oneFrameBtn").hide();
		$("#pauseContinueBtn").text("Pause");
	}
	$("#pauseContinueBtn").click(function(){
		if($(this).text() == "Pause"){
			$("#oneFrameBtn").show();
			clearInterval(drawId);
			$(this).text("Continue");
		}else{
			start();
		}
	})
	$("#restartBtn").click(function(){
		clearInterval(drawId)
		$("#path2").attr("points", "");
		$("#path1").attr("points", "");
		$("#counter").text(0)
		init();
		apply();
		start();
	});
	$("#applyBtn").click(function() {apply();});
	$("#oneFrameBtn").click(function() {draw();});
	apply();
	init();
    var drawId = setInterval(draw, 1000 / fps);
});