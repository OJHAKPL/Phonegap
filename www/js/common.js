	/*--------- Login -----------*/  
	function homeLogin() {
		$.post(
		"https://www.nd2nosmart.cards/nd2no/admin/web-login",
		{
		  email: $("#login-email").val(),
		  password: $("#login-password").val()
		},
		function(data,status){
			var dataArray = jQuery.parseJSON(data);
			var htmlStr='';
			$.each(dataArray, function(i, field){	
			
				if(field.email){
				
					if($('#keep_me_login').is(":checked")) {
						localStorage.setItem('email', field.email);
						localStorage.setItem('userid', field.id);
					} else {
						localStorage.setItem('userid-2', field.id);
					}				
					$.post(
						"https://www.nd2nosmart.cards/nd2no/admin/web-show-folders",
						{
						  user_id: field.id
						},
						function(folderlist,status){
							$('.allfoldert').remove();
							var folderlistArr = jQuery.parseJSON(folderlist);									
							$.each( folderlistArr, function(i, row1) {
								$.each( row1, function(i, row) {
									$('#folder_list').append('<li class="allfoldert"><a href="javascript:void(0);" onClick="showFoldercards('+row.id+');"  class="folderhyper">'+row.folder_name+'<span class="counter">('+row.cards+')</span></a></li>');
								});
							});
						}
					);
					$.mobile.changePage("#dashboard");
				
				} else {
					if(dataArray.error){
						$(".errorMsgShow").show();
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(dataArray.error);
					}		
				}					
			});					
		});
	}
	
	
	
	/*---------- Display cards in folder ----------*/
	function showFoldercards(folderId) {
		$.mobile.changePage("#card-list");
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-folder-cards",
			{
			  folder_id: folderId,
			},
			function(cardlist,status){
				$('.allcardlist').remove();
				var cardlistArr = jQuery.parseJSON(cardlist);
				if(!cardlistArr.error) {
					$.each( cardlistArr, function(i, row1) {
						$.each( row1, function(i, row) {
							$('.cardslistHtml').append('<div class="card-box allcardlist"><div class="card-option-open"><a href="javascript:void(0);" class="tick-button ui-link"><img onClick="cartDetails('+row.id+');" src="images/eye-icon.png" alt=""></a><a href="javascript:void(0);" onClick="addCart('+row.id+');" id="cd_'+row.id+'" class="tick-button ui-link"><img class="cardclass_'+row.id+'" src="images/tick-icon-black.png" alt=""></a> <a href="javascript:void(0);" onClick="deleteMyfolder('+row.card_shared_id+')" class="tick-button ui-link"><img src="images/delete-icon.png" alt=""></a></div><div class="img"><img width="100%" src="https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+row.banner+'" alt=""></div></div>');
						});
					});
				} else {						
					$(".errorMsgShow").show();
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(cardlistArr.error);						
				}
			}
		) 
	}
	
	
	function deleteMyfolder(card_shared_id){
		
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-folder-delete",
			{
				shared_id: card_shared_id,
			},
			function(result, status){
				var resultArr = jQuery.parseJSON(result);
				if(resultArr.success){
					$(".errorMsgShow").show();
					$(".errorMsgShow").removeClass("error");
					$(".errorMsgShow").addClass("success");
					$(".errorMsgShow").text(resultArr.success); 
					showFoldercards(resultArr.folder_id);					
				} else {						
					$(".errorMsgShow").show();
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(resultArr.error);						
				}
			}
		) 
	}


	/*----------- card details from notification----------*/
	function cartDetailsNotification(cardId) {
		
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-cards-detail",
			{
			  id: cardId
			},
			function(cardDetails,status){
				
				$('.allfoldert').remove();
				var cardDetailsArr = jQuery.parseJSON(cardDetails);
				
				$(".card-link-details>div").remove();
				$(".allsociallink").remove();
				
				$.each( cardDetailsArr, function(i, firstRow) {	
					$('.card-link-details').append('<input type="hidden" name="sharecard_id" id="sharecard_id" value="'+firstRow[0].id+'"><div class="main-img"><img src="https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+firstRow[0].banner+'" width="100%" alt=""></div><div class="card-header"><div class="pull-right"><a href="#shareCarddetails" data-rel="popup"><button class="ui-btn ui-shadow ui-corner-all"><img src="images/share-icon.png" alt=""></button></a></div><h3 class="title">'+firstRow[0].title+'</h3></div><div class="card-icons"><a class="ui-link" href=""><img src="images/fb-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/twitter-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/instagram-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/globe-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/video1-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/video2-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/video3-icon.png" alt=""></a></div>');
				});
				
				$.each( cardDetailsArr, function(i, row1) {
					$.each( row1, function(i, row) {
						$('.card-link-details2').append('<ul class="card-details allsociallink"><li><div class="img"><img src="images/fb-icon.png" alt=""></div><div class="title"><a class="ui-link" href="'+row.card_value+'" target="_blank">My Facebook Profile</a></div></li></ul>');
					});
				}); 
			}
		);
		
		
		user_id = localStorage.getItem('userid');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-2');
		}	
		if(user_id){
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-reset-notification",
				{
					card_id: cardId,
					user_id: user_id
				},
				function(result, status){
					
				}
			); 
			$.mobile.changePage("#card-details");
		} else {
			//$.mobile.changePage("#login");
		}
	}




	/*--------- Shared Card List-----------*/
	function sharedcardlist(){
		
		user_id = localStorage.getItem('userid');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-2');
		}
		if(user_id){
			$.mobile.changePage("#shared-card-list");
			$('.sharelistloader').show();
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-shared-cards",
				{
				  user_id: user_id,
				},
				function(cardlist,status){
					$('.allcardlist').remove();
					var cardlistArr = jQuery.parseJSON(cardlist);
					if(!cardlistArr.error) {
						$.each( cardlistArr, function(i, row1) {
							$.each( row1, function(i, row) {
								
								tickiconImg = 'images/tick-icon-black.png'
								alredyexist = false;
								if(localStorage.cartitem){
									var strVale = localStorage.cartitem;
									arrCheak = strVale.split(',');
									for(i=0; i < arrCheak.length; i++){
										if(arrCheak[i]==row.id){
											alredyexist = true;
										}
									}
								}
								if(alredyexist)
									tickiconImg = 'images/tick-icon-black1.png';
								
								$('.cardslistHtml').append('<div class="card-box allcardlist"><div class="card-option-open"><a href="javascript:void(0);" class="tick-button ui-link"><img onClick="cartDetails('+row.id+');" src="images/eye-icon.png" alt=""></a><a href="javascript:void(0);" onClick="addCart('+row.id+');" class="tick-button ui-link"><img class="cardclass_'+row.id+'" src="'+tickiconImg+'" alt=""></a> <a href="javascript:void(0);" class="tick-button ui-link"><img onClick="deleteCard('+row.card_shared_id+');" src="images/delete-icon.png" alt=""></a></div><div class="img"><img width="100%" src="https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+row.banner+'" alt=""></div></div>');
							});
						});
						$('.sharelistloader').hide();
					} else {
						$('.sharelistloader').hide();
						$(".errorMsgShow").show();
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(cardlistArr.error);						
					}
				}
			)
		} else {
			//$.mobile.changePage("#login");
		}
	}
		
	/*---------- Delete shared card ----------*/
	function deleteCard(card_shared_id) { 
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-remove-shared-card",
			{
				shared_id: card_shared_id,
			},
			function(result, status){
				$('.allcardlist').remove();
				var resultArr = jQuery.parseJSON(result);
				if(resultArr.success){
					$(".errorMsgShow").show();
					$(".errorMsgShow").removeClass("error");
					$(".errorMsgShow").addClass("success");
					$(".errorMsgShow").text(resultArr.success); 
					sharedcardlist()
				}else {						
					$(".errorMsgShow").show();
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(resultArr.error);						
				}
			}
		) 
	}	

	/*---------- Add card to cart ----------*/
	function addCart(cardId) { 

		var srcName = $('.cardclass_'+cardId).attr('src');
		if(srcName=='images/tick-icon-black.png'){
			$('.cardclass_'+cardId).attr('src', 'images/tick-icon-black1.png');
			localStorage.setItem('cardIdValue['+cardId+']', cardId);	
			
			if (!localStorage.cartitem){
				localStorage.cartcount = 1;
				localStorage.cartitem = cardId;
			} else {
				var str2= localStorage.cartitem;
				if (-1 == str2.search(cardId)){
				localStorage.cartcount ++;
				localStorage.cartitem = localStorage.cartitem +',' +cardId;
				} 
			}
				var str= localStorage.cartitem;
				localStorage.cartitem = str.replace(',,', ","); 
		} else {
			$('.cardclass_'+cardId).attr('src', 'images/tick-icon-black.png');
			localStorage.removeItem('cardIdValue['+cardId+']');
				var str= localStorage.cartitem;
				var str1= str.replace(cardId, ""); 
				localStorage.cartitem = str1.replace(',,', ","); 
				localStorage.cartcount --;
				
			}
			
		$('.counter-cardtick').text(localStorage.cartcount);
	}
			
				
	/*---------- Remove card selected ----------*/
	function removeSelected(cardId) {

		var str= localStorage.cartitem;
		var str1= str.replace(cardId, ""); 
		localStorage.cartitem = str1.replace(',,', ","); 
		localStorage.cartcount --;
		
		if (!localStorage.cartitem){
		var items = '';
		} else {
		var items =localStorage.cartitem;
		}

		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-selected-cards",
			{
			  selected_card_ids: items
			},
			function(cardlist,status){
				$('.Allselectedcards').remove();
				var cardlistArr = jQuery.parseJSON(cardlist);
			
			
			if(!cardlistArr.error) {
					$.each( cardlistArr, function(i, row1) {
						$.each( row1, function(i, row) {				
							$('.ticked-list').append('<li class="Allselectedcards"><div class="card-option"><a href="javascript:void(0);" class="tick-button ui-link"><img onClick="removeSelected('+row.id+');" src="images/delete-icon.png" alt=""></a></div><div class="img"><img src="https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+row.banner+'" alt=""></div></li>');
						
						});
					});
				} else {
					$(".errorMsgShow").show();
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(cardlistArr.error);
				}
			}
		)
		
		if (!localStorage.cartcount){
		var itemcount = 0;
		} else {
		var itemcount =localStorage.cartcount;
		}
		$('.counter-cardtick').text(itemcount);
		$.mobile.changePage("#selected-cards");

	}


	/*----------- card details ----------*/
	function cartDetails(cardId) {
		
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-cards-detail",
			{
			  id: cardId
			},
			function(cardDetails,status){
				
				$('.allfoldert').remove();
				var cardDetailsArr = jQuery.parseJSON(cardDetails);
				
				$(".card-link-details>div").remove();
				$(".allsociallink").remove();
				
				$.each( cardDetailsArr, function(i, firstRow) {	
					$('.card-link-details').append('<input type="hidden" name="sharecard_id" id="sharecard_id" value="'+firstRow[0].id+'"><div class="main-img"><img src="https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+firstRow[0].banner+'" width="100%" alt=""></div><div class="card-header"><div class="pull-right"><a href="#shareCarddetails" data-rel="popup"><button class="ui-btn ui-shadow ui-corner-all"><img src="images/share-icon.png" alt=""></button></a></div><h3 class="title">'+firstRow[0].title+'</h3></div><div class="card-icons"><a class="ui-link" href=""><img src="images/fb-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/twitter-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/instagram-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/globe-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/video1-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/video2-icon.png" alt=""></a><a class="ui-link" href=""><img src="images/video3-icon.png" alt=""></a></div>');
				});
				
				$.each( cardDetailsArr, function(i, row1) {
					$.each( row1, function(i, row) {
						$('.card-link-details2').append('<ul class="card-details allsociallink"><li><div class="img"><img src="images/fb-icon.png" alt=""></div><div class="title"><a class="ui-link" href="'+row.card_value+'" target="_blank">My Facebook Profile</a></div></li></ul>');
					});
				}); 
			}
		);
		$.mobile.changePage("#card-details");
	}



	/*----------- card details ----------*/
	function editCard(cardId){
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-update-card",{
				card_id: cardId,
			},
			function(profiledetails, status){
				$('.Allprofileview').remove();
				
				var profileArr = jQuery.parseJSON(profiledetails);
				if(!profileArr.error) {
					$.each( profileArr, function(i, row) {
						var title   		= row.title;
						var statusActive	= (row.status==1)?'selected':'';
						var statusInactive	= (row.status==0)?'selected':'';
						var banner			= (row.banner && row.banner!='')?'https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+row.banner+'':'images/card-thumb.png';
						
						var title_html	= '<div class="ui-input-text ui-body-inherit"><input type="text" value="'+row.title+'" id="title" placeholder="Title" name="title"></div>';
						//var banner_html	= '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="file" id="banner" name="banner"></div>';
						var status_html = '<div class="ui-input-text ui-body-inherit"><select class="select_class" name="status" id="status"><option '+statusActive+' value="1">Active</option><option '+statusInactive+' value="0">Inactive</option></select></div>';
						
						//var title_html	= '<input type="text" value="'+row.title+'" id="title" placeholder="Title" name="title">';
						//var status_html = '<select class="select_class" name="status" id="status"><option '+statusActive+' value="1">Active</option><option '+statusInactive+' value="0">Inactive</option></select>';
						var banner_html	= ''; 
						
						$('.updateCard').append('<div class="Allprofileview"><div class="main-img"><img src="'+banner+'" width="100%" alt=""></div><div class="card-header"><h3 class="title">'+title+'</h3></div><form name="edit_card" id="edit_card" enctype="multipart/form-data" method="post"><div class="page-form"><input type="hidden" name="card_id" id="card_id" value="'+row.id+'">'+ title_html + banner_html + status_html +'</div><button onClick="EditCardSubmit()" class="ui-btn ui-btn-submit ui-corner-all">Edit Card</button></form></div>');
					});
				} else {
					$(".errorMsgShow").show();
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(profileArr.error);
				}
				$.mobile.changePage("#update-card");
			}
		)
	}





	function EditCardSubmit(){

		/*--------- Edit Profile -----------*/  
		$('#edit_card').validate({
			rules: {
				title: {
					required: true
				}
			},
			messages: {
				title: {
					required: "Please enter title."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {
				$.post(
					"https://www.nd2nosmart.cards/nd2no/admin/web-update-card",{
						card_id: jQuery('#edit_card').find('input[name="card_id"]').val(),
						title: jQuery('#edit_card').find('input[name="title"]').val(),
						status: jQuery('#edit_card').find('input[name="status"]').val(), 
					},
					function(registerData){
						var dataMsg = jQuery.parseJSON(registerData);	
						if(dataMsg.error){
							$(".errorMsgShow").show();
							$(".errorMsgShow").removeClass("success");
							$(".errorMsgShow").addClass("error");
							$(".errorMsgShow").text(dataMsg.error);								
							setTimeout(function() {
								$('.errorMsgShow').hide();
							}, 4000);	
							
						}else if(dataMsg.success){
							$(".errorMsgShow").show();
							$(".errorMsgShow").removeClass("error");
							$(".errorMsgShow").addClass("success");
							$(".errorMsgShow").text(dataMsg.success);
							editCard(dataMsg.card_id); 
						}
					}
				)
			}
		});
	}


	function shareEmailCheck(){
		email = $('#share-email').val();
		sharecard_id = $('#sharecard_id').val();
		
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-share-cards",
			{
			  email: email,
			  card_id: sharecard_id,
			},
			function(data,status){
				
				localStorage.removeItem('cartitem');
				localStorage.removeItem('cartcount');
				$('.counter-cardtick').text('0');
				
				var dataMsg = jQuery.parseJSON(data);
				if(dataMsg.error){
					$(".errorMsgShow-2").show();
					$(".errorMsgShow-2").removeClass("success");
					$(".errorMsgShow-2").addClass("error");
					$(".errorMsgShow-2").text(dataMsg.error);							
					setTimeout(function() {
						$('.errorMsgShow-2').hide();
					}, 4000);
				}
				if(dataMsg.success){
					$(".errorMsgShow-2").show();
					$(".errorMsgShow-2").removeClass("error");
					$(".errorMsgShow-2").addClass("success");
					$(".errorMsgShow-2").text(dataMsg.success);
					setTimeout(function() {
						$('.errorMsgShow-2').hide();
						$('#share-email').val('');
						$('#shareCarddetails').popup('close');
					}, 4000);	
					 
				}
			}
		);
	}


	function shareEmailCheckMultiple(){
		email = $('#share-email2').val();
		sharecard_id = localStorage.cartitem;			
		
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-share-cards",
			{
			  email: email,
			  card_id: sharecard_id,
			},
			function(data,status){
				
				localStorage.removeItem('cartitem');
				localStorage.removeItem('cartcount');
				$('.counter-cardtick').text('0');
				
				var dataMsg = jQuery.parseJSON(data);
				if(dataMsg.error){
					$(".errorMsgShow-2").show();
					$(".errorMsgShow-2").removeClass("success");
					$(".errorMsgShow-2").addClass("error");
					$(".errorMsgShow-2").text(dataMsg.error);							
					setTimeout(function() {
						$('.errorMsgShow-2').hide();
					}, 4000);
				}
				if(dataMsg.success){
					$(".errorMsgShow-2").show();
					$(".errorMsgShow-2").removeClass("error");
					$(".errorMsgShow-2").addClass("success");
					$(".errorMsgShow-2").text(dataMsg.success);
					setTimeout(function() {
						$('.errorMsgShow-2').hide();
						$('#share-email').val('');
						$('#shareCarddetails2').popup('close');
					}, 4000);	
					 
				}
			}
		);
	}


	function viewProfile(){
		
		user_id = localStorage.getItem('userid');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-2');
		}
		if(user_id){
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-user-info",
				{
				  id: user_id,
				},
				function(profiledetails,status){
					$('.Allprofileview').remove();
					var profileArr = jQuery.parseJSON(profiledetails);
					if(!profileArr.error) {
						$.each( profileArr, function(i, row) {
							var nameUser    = row.first_name+' '+row.middle_name+' '+row.last_name;
							var genderUser  = (row.gender==1)?'Male':'Female';
							var street_1    = (row.street_1 && row.street_1!='')?row.street_1+' ':''; 
							var street_2    = (row.street_2 && row.street_2!='')?row.street_2+', ':'';
							var state       = (row.state && row.state!='')?row.state+', ':'';
							var city        = (row.city && row.city!='')?row.city+', ':'';
							var zip         = (row.zip && row.zip!='')?row.zip+' ':'';
							var country     = (row.name && row.name!='')?row.name+' ':'';
							var addressUser = street_1+street_2+city+state+country+zip;
							var photoUser   = (row.photo && row.photo!='')?'https://www.nd2nosmart.cards/nd2no/upload/users/profile-photo/resized/'+row.photo+'':'images/blank_profile.png';
							var dob = (row.dob)?row.dob:'';
							var about_you   = (row.about_you)?row.about_you:'';
							var mobile      = (row.mobile)?row.mobile:'';
							
							$('.ProfileUpdate').append('<div class="Allprofileview"><div class="main-img"><img src="'+photoUser+'" width="100%" alt=""></div><div class="card-header"><div class="pull-right"><button onClick="changeProfile('+row.id+')" class="ui-btn ui-shadow ui-corner-all"><img src="images/edit-icon.png" width="24" alt=""></button></div><h3 class="title">'+row.uid.toUpperCase()+' – '+nameUser+'</h3><p>'+row.email+'</p><p>'+mobile+'</p></div><div class="page-form"><h3 class="title">Other Details</h3><p><b>Dob: </b>'+dob+'</p><p><b>Gender: </b>'+genderUser+'</p><p><b>Address: </b>'+addressUser+'</p><p><b>About You: </b>'+about_you+'</p></div></div>');
						});
					} else {
						$(".errorMsgShow").show();
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(profileArr.error);
					}
					$.mobile.changePage("#my-profile");
				}
			)
		} else {
			//$.mobile.changePage("#login");
		}
	}


	function changeProfile(id){
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-user-info",
			{
			  id: id,
			},
			function(profiledetails,status){
				$('.Allprofileview').remove();
				var profileArr = jQuery.parseJSON(profiledetails);
				if(!profileArr.error) {
					$.each( profileArr, function(i, row) {
						var nameUser     	= row.first_name+' '+row.middle_name+' '+row.last_name;
						var genderMale   	= (row.gender==1)?'selected':'';
						var genderFemale 	= (row.gender==2)?'selected':'';
						var photoUser    	= (row.photo && row.photo!='')?'https://www.nd2nosmart.cards/nd2no/upload/users/profile-photo/resized/'+row.photo+'':'images/blank_profile.png';
						var country_id_val 	= row.country_id;
						var country_name_val= row.name;
						var dob = (row.dob && row.dob!='')?row.dob:'';
						var street_1 = (row.street_1 && row.street_1!='')?row.street_1:'';
						var street_2 = (row.street_2 && row.street_2!='')?row.street_2:'';
						var city = (row.city && row.city!='')?row.city:'';
						var zip = (row.zip && row.zip!='')?row.zip:'';
						var state = (row.state && row.state!='')?row.state:'';
						var phone = (row.phone && row.phone!='')?row.phone:'';
						var mobile = (row.mobile && row.mobile!='')?row.mobile:'';
		 				var countryDropDown = '<select name="country_id" id="country_id" style="max-width:100%;" class="countryUpdate"><option id="countryUpdateSpan" value="">Select Country</option></select>';
						
						$('.EditProfileHtml').append('<div class="Allprofileview"><div class="main-img"><img src="'+photoUser+'" width="100%" alt=""></div><div class="card-header"><h3 class="title">'+row.uid.toUpperCase()+' – '+nameUser+'</h3><p>'+row.email+'</p></div><form name="editprofile" id="editprofile" enctype="multipart/form-data" method="post"><div class="page-form"><input type="hidden" name="user_id" id="user_id" value="'+row.id+'"><input type="text" name="first_name" placeholder="First Name" id="first_name" value="'+row.first_name+'"><input type="text" name="middle_name" placeholder="Middle Name" id="middle_name" value="'+row.middle_name+'"><input type="text" name="last_name" placeholder="Last Name" id="last_name" value="'+row.last_name+'"><input type="text" name="dob" placeholder="DOB" id="dob" value="'+dob+'"><select name="gender" id="gender"><option '+genderMale+' value="1">Male</option><option '+genderFemale+' value="2">Female</option></select><input type="text" name="street1" placeholder="Street" id="street1" value="'+street_1+'"><input type="text" name="street2" placeholder="Landmark" id="street2" value="'+street_2+'"><input type="text" name="city" placeholder="City" id="city" value="'+city+'"><input type="text" name="zip" placeholder="Zip / Postal Code" id="zip" value="'+zip+'"><input type="text" name="state" placeholder="State" id="state" value="'+state+'">'+ countryDropDown +'<input type="text" name="phone" placeholder="Phone" id="phone" value="'+phone+'"><input type="text" name="mobile" placeholder="Mobile" id="mobile" value="'+mobile+'"></div><button onClick="EditProfileSubmit()" class="ui-btn ui-btn-submit ui-corner-all">Edit Profile</button></form></div>');
					 
						$.post(
							"https://www.nd2nosmart.cards/nd2no/admin/select-countries-data",
							function(countryData,status){									
								$('.Allcountryview').remove();
								var countryArr = jQuery.parseJSON(countryData);									
								$.each( countryArr, function(i, row1) {
									$.each( row1, function(i, row) {
										var selected = (row.id==country_id_val)?'selected':'';
										jQuery('#country_id').append(jQuery("<option "+ selected +"></option>").attr("value", row.id).text(row.name));
									});
								});
								if(country_id_val && country_name_val){
									jQuery('span.countryUpdate').html(country_name_val);
								}
							}
						)
						
					});
				} else {
					$(".errorMsgShow").show();
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(profileArr.error);
				}
				$.mobile.changePage("#update-profile");
			}
		)
	}


	function EditProfileSubmit(){

		/*--------- Edit Profile -----------*/  
		$('#editprofile').validate({
			rules: {
				first_name: {
					required: true
				},
				phone: {
					required: true,
					digits: true
				},
				mobile: {
					required: true,
					digits: true
				},
			},
			messages: {
				first_name: {
					required: "Please enter your first name."
				},
				phone: {
					required: "Please enter your phone."
				},
				mobile: {
					required: "Please enter your mobile."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {
				//var formData = new FormData($(this)[0]);
				//var formData = new FormData( this );

				$.post(
					"https://www.nd2nosmart.cards/nd2no/admin/web-update-profile",
					$("#editprofile").serialize(),
					function(registerData,status){
						var dataMsg = jQuery.parseJSON(registerData);	
						if(dataMsg.error){
							$(".errorMsgShow").show();
							$(".errorMsgShow").removeClass("success");
							$(".errorMsgShow").addClass("error");
							$(".errorMsgShow").text(dataMsg.error);								
							setTimeout(function() {
								$('.errorMsgShow').hide();
							}, 4000);
						}
						if(dataMsg.success){
							$(".errorMsgShow").show();
							$(".errorMsgShow").removeClass("error");
							$(".errorMsgShow").addClass("success");
							$(".errorMsgShow").text(dataMsg.success);
							viewProfile();
							//$.mobile.changePage("#dashboard");
						}
					}
				)
			}
		});
	}


		
		
	/*----------- Logout -----------*/
	function logout(){ 
		window.localStorage.clear();
		$.mobile.changePage("#login");
	}
		

	/*--------- Favorite List-----------*/
	function favoritelist(){
		
		user_id = localStorage.getItem('userid');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-2');
		}
		if(user_id){
			$.mobile.changePage("#favorite-list");
			$('.favoritelistloader').show();
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-show-favourites",
				{
				  user_id: user_id,
				},
				function(cardlist,status){
					$('.allfavoritelist').remove();
					var cardlistArr = jQuery.parseJSON(cardlist);
					if(!cardlistArr.error) {
						$.each( cardlistArr, function(i, row1) {
							$.each( row1, function(i, row) {
								tickiconImg = 'images/tick-icon-black.png'
								alredyexist = false;
								if(localStorage.cartitem){
									var strVale = localStorage.cartitem;
									arrCheak = strVale.split(',');
									for(i=0; i < arrCheak.length; i++){
										if(arrCheak[i]==row.id){
											alredyexist = true;
										}
									}
								}
								if(alredyexist)
									tickiconImg = 'images/tick-icon-black1.png';
								 
								
								$('.favoritelistHtml').append('<div class="card-box allfavoritelist"><div class="card-option-open"><a href="javascript:void(0);" class="tick-button ui-link"><img  onClick="cartDetails('+row.id+');" src="images/eye-icon.png" alt=""></a><a href="javascript:void(0);" onClick="addCart('+row.id+');" id="cd_'+row.id+'" class="tick-button ui-link"><img class="cardclass_'+row.id+'" src="'+tickiconImg+'" alt=""></a> <a href="javascript:void(0);" onClick="removeFavorite('+row.card_favourite_id+');" class="tick-button ui-link"><img src="images/delete-icon.png" alt=""></a></div><div class="img"><img width="100%" src="https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+row.banner+'" alt=""></div></div>');
							});
						});
						$('.favoritelistloader').hide();
					} else {
						$('.favoritelistloader').hide();
						$(".errorMsgShow").show();
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(cardlistArr.error);
					}
				}
			) 
		} else {
			//$.mobile.changePage("#login");
		}
	}



	/*---------- Delete favorite-list  ----------*/
	function removeFavorite(card_favourite_id) { 
		$.post(
			"https://www.nd2nosmart.cards/nd2no/admin/web-remove-favourite-card",
			{
				favourite_id: card_favourite_id,
			},
			function(result, status){
				var resultArr = jQuery.parseJSON(result);
				if(resultArr.success){
					$(".errorMsgShow").show();
					$(".errorMsgShow").removeClass("error");
					$(".errorMsgShow").addClass("success");
					$(".errorMsgShow").text(resultArr.success); 
					favoritelist()
				}else {						
					$(".errorMsgShow").show();
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(resultArr.error);						
				}
			}
		) 
	}


	/*--------- Card List-----------*/
	function cardlist(){
		
		user_id = localStorage.getItem('userid');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-2');
		}
		if(user_id){
			$.mobile.changePage("#card-list");
			$('.cardlistloader').show();
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-user-cards",
				{
				  user_id: user_id,
				},
				function(cardlist,status){
					$('.allcardlist').remove();
					var cardlistArr = jQuery.parseJSON(cardlist);
					if(!cardlistArr.error) {
						$.each( cardlistArr, function(i, row1) {
							$.each( row1, function(i, row) {
								$('.cardslistHtml').append('<div class="card-box allcardlist"><div class="card-option-open"><a href="javascript:void(0);" class="tick-button ui-link"><img onClick="cartDetails('+row.id+');" src="images/eye-icon.png" alt=""></a><a href="javascript:void(0);" class="tick-button ui-link"><img onClick="editCard('+row.id+');" src="images/edit-icon.png" alt=""></a></div><div class="img"><img width="100%" src="https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+row.banner+'" alt=""></div></div>');
							});
						});
						$('.cardlistloader').hide();
					} else {
						$('.cardlistloader').hide();	
						$(".errorMsgShow").show();
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(cardlistArr.error);						
					}
				}
			)
		} else {
			//$.mobile.changePage("#login");
		}
	}
		

	/*--------- Move Card-----------*/
	function moveTocard(){
		
		user_id = localStorage.getItem('userid');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-2');
		}
		if(user_id){	
			$('#movetofolder').popup('open');
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-folder-list",
				{
				  user_id: user_id,
				},
				function(folderlist,status){
					$('.folderDiv').remove();
					var folderArr = jQuery.parseJSON(folderlist);
					if(!folderArr.error) {
						$.each( folderArr, function(i, row1) {
							$.each( row1, function(i, row) {
								$('.movetoHtml').append('<div class="folderDiv"><label><input id="folder_name_to" type="radio" checked="" value="'+row.id+'" name="folder_name_to">&nbsp;'+row.folder_name+'</label></div>');
							});
						});
					} else {						
						$(".errorMsgShow").show();
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(folderArr.error);						
					}
				}
			)
		} else {
			//$.mobile.changePage("#login");
		}
	}
		
		
		
		
	function moveTofoldersave(){
		
		user_id = localStorage.getItem('userid');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-2');
		}
		if(user_id){
			folder_name = $('input[name=folder_name_to]:radio:checked').val();
			card_id = localStorage.cartitem;
			
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-folder-moveto",
				{
				  user_id: user_id,
				  folder_id: folder_name,
				  card_id: card_id,
				},
				function(data,status){
					localStorage.removeItem('cartitem');
					localStorage.removeItem('cartcount');
					$('.counter-cardtick').text('0');
					var dataMsg = jQuery.parseJSON(data);
					if(dataMsg.error){
						$(".errorMsgShow-2").show();
						$(".errorMsgShow-2").removeClass("success");
						$(".errorMsgShow-2").addClass("error");
						$(".errorMsgShow-2").text(dataMsg.error);							
						setTimeout(function() {
							$('.errorMsgShow-2').hide();
						}, 4000);
					}
					if(dataMsg.success){
						
						$(".errorMsgShow-2").show();
						$(".errorMsgShow-2").removeClass("error");
						$(".errorMsgShow-2").addClass("success");
						$(".errorMsgShow-2").text(dataMsg.success);
						setTimeout(function() {
							$('.errorMsgShow-2').hide();
							$('#share-email').val('');
							$('#movetofolder').popup('close');
							$(".counter-cardtick").click();
						}, 4000);	
						 
					}
				}
			);
		} else {
			//$.mobile.changePage("#login");
		}
	}	
		


		
	$(document).ready(function(){

		/*--------- Register -----------*/  
		$('#register_form').validate({
			rules: {
				first_name: {
					required: true
				},
				email: {
					required: true,
					email: true
				},
				phone: {
					required: true,
					digits: true
				},
				password: {
					required: true, minlength: 6
				},
				terms_conditions: {
					required: true
				},
			},
			messages: {
				first_name: {
					required: "Please enter your first name."
				},
				email: {
					required: "Please enter your email."
				},
				phone: {
					required: "Please enter your phone."
				},
				password: {
					required: "Please enter your password."
				},
				terms_conditions: {
					required: "Please agree terms & conditions."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {				
				$.post(
					"https://www.nd2nosmart.cards/nd2no/admin/web-register",
					$("#register_form").serialize(),
					function(registerData,status){
						var dataMsg = jQuery.parseJSON(registerData);	
						if(dataMsg.error){
							$(".errorMsgShow").show();
							$(".errorMsgShow").removeClass("success");
							$(".errorMsgShow").addClass("error");
							$(".errorMsgShow").text(dataMsg.error);								
							setTimeout(function() {
								$('.errorMsgShow').hide();
							}, 4000);								
						}
						if(dataMsg.success){
							$("#register_form").trigger('reset');
							$(".errorMsgShow-2").show();
							$(".errorMsgShow-2").removeClass("error");
							$(".errorMsgShow-2").addClass("success");
							$(".errorMsgShow-2").text(dataMsg.success);
							window.localStorage.clear();
							$.mobile.changePage("#login");	
						}
					}
				)
			}
		});
		
		
		
		/*--------- Page Before Show -----------*/
		$(document).on('pagebeforeshow', '#login', function(){ 
		
			user_id = localStorage.getItem('userid');
			if(user_id==null || user_id==''){
				user_id = localStorage.getItem('userid-2');
			}
			if(user_id){
			
				if(localStorage.getItem('email')) {
					$.post(
						"https://www.nd2nosmart.cards/nd2no/admin/web-show-folders",
						{
						  user_id: user_id
						},
						function(folderlist,status){
							$('.allfoldert').remove();
							var folderlistArr = jQuery.parseJSON(folderlist);									
							$.each( folderlistArr, function(i, row1) {
								$.each( row1, function(i, row) {
									$('#folder_list').append('<li class="allfoldert"><a href="javascript:void(0);" onClick="showFoldercards('+row.id+');"  class="folderhyper">'+row.folder_name+'<span class="counter">('+row.cards+')</span></a></li>');
								});
							});
						}
					);				
					$.mobile.changePage("#dashboard");
				}
			} else {
				//$.mobile.changePage("#login");
			}
		});
		
		
		
		/*--------- Page Before Show -----------*/
		$(document).on('pagebeforeshow', '#dashboard', function(){ 
			user_id = localStorage.getItem('userid');
			if(user_id==null || user_id==''){
				user_id = localStorage.getItem('userid-2');
			}
			if(user_id){
				$.post(
					"https://www.nd2nosmart.cards/nd2no/admin/web-show-folders",
					{
					  user_id: user_id
					},
					function(folderlist,status){
						$('.allfoldert').remove();
						var folderlistArr = jQuery.parseJSON(folderlist);									
						$.each( folderlistArr, function(i, row1) {
							$.each( row1, function(i, row) {
								$('#folder_list').append('<li class="allfoldert"><a href="javascript:void(0);" onClick="showFoldercards('+row.id+');"  class="folderhyper">'+row.folder_name+'<span class="counter">('+row.cards+')</span></a></li>');
							});
						});
					}
				);				
				$.mobile.changePage("#dashboard");
			} else {
				//$.mobile.changePage("#login");
			}
		});	


		/*--------- Folder Save-----------*/
		$("#folder_save").click(function(){	
		
			user_id = localStorage.getItem('userid');
			if(user_id==null || user_id==''){
				user_id = localStorage.getItem('userid-2');
			}
			if(user_id){
		
				$.post(
					"https://www.nd2nosmart.cards/nd2no/admin/web-create-folder",
					{
					  user_id: user_id,
					  folder_name: $("#folder_name").val()
					},
					function(data,status){
					
						var dataMsg = jQuery.parseJSON(data);
						
						if(dataMsg.error){
							$(".errorMsgShow").show();
							$(".errorMsgShow").removeClass("success");
							$(".errorMsgShow").addClass("error");
							$(".errorMsgShow").text(dataMsg.error);							
							setTimeout(function() {
								$('.errorMsgShow').hide();
							}, 4000);
						}
						if(dataMsg.success){
							$(".errorMsgShow").show();
							$(".errorMsgShow").removeClass("error");
							$(".errorMsgShow").addClass("success");
							$(".errorMsgShow").text(dataMsg.success);
							setTimeout(function() {
								$('.errorMsgShow').hide();
							}, 4000);							
						}
						
						
						$("#folder_name").val('');
						$.post(
							"https://www.nd2nosmart.cards/nd2no/admin/web-show-folders",
							{
							  user_id: user_id
							},
							function(folderlist,status){							
								$('.allfoldert').remove();
								var folderlistArr = jQuery.parseJSON(folderlist);									
								$.each( folderlistArr, function(i, row1) {
									$.each( row1, function(i, row) {
										$('#folder_list').append('<li class="allfoldert"><a href="javascript:void(0);" onClick="showFoldercards('+row.id+');"  class="folderhyper">'+row.folder_name+'<span class="counter">('+row.cards+')</span></a></li>');
									});
								});
							}
						);
					}
				);
			} else {
				//$.mobile.changePage("#login");
			}
		});
		
		
		
		/*----------- Forgot Password -----------*/
		$("#forgot-email-button").click(function(){
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-forget-password",
				{
				  email: $("#forgot-email").val(),
				},
				function(forgotData,status){
					var dataMsg = jQuery.parseJSON(forgotData);
					if(dataMsg.error){
						$(".errorMsgShow").show();
						$(".errorMsgShow").removeClass("success");
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(dataMsg.error);							
						setTimeout(function() {
							$('.errorMsgShow').hide();
						}, 4000);
						
					}
					if(dataMsg.success){
						$(".errorMsgShow-2").show();
						$(".errorMsgShow-2").removeClass("error");
						$(".errorMsgShow-2").addClass("success");
						$(".errorMsgShow-2").text(dataMsg.success);
						$("#forgot-email").val('');
						$.mobile.changePage("#login");
					}
				}
			)
		});
		
		
		/*----------- Notifications Count -----------*/
		$(document).on('pagebeforeshow', function(){
			
			setTimeout(function() {
				$('.errorMsgShow-2').hide();
			}, 4000);
		
			$(".errorMsgShow").hide();		
			if (!localStorage.cartcount){
			var itemcount = 0;
			} else {
			var itemcount =localStorage.cartcount;
			}
			$('.counter-cardtick').text(itemcount);
			
			user_id = localStorage.getItem('userid');
			if(user_id==null || user_id==''){
				user_id = localStorage.getItem('userid-2');
			}
			if(user_id){
				$.post(
					"https://www.nd2nosmart.cards/nd2no/admin/web-notification-total",
					{
					  user_id: user_id
					},
					function(countcard,status){
						var cardCount = jQuery.parseJSON(countcard);
						$('.counter-notify').text(cardCount.success);
					}
				);
			} else {
				//$.mobile.changePage("#login");
			}
		});
		
		/*----------- Notifications List -----------*/
		$(".counter-notify").click(function(){
			
			
			user_id = localStorage.getItem('userid');
			if(user_id==null || user_id==''){
				user_id = localStorage.getItem('userid-2');
			}
			if(user_id){
			
				$.mobile.changePage("#notification");
				$('.notificationlistloader').show();
				$.post(
					"https://www.nd2nosmart.cards/nd2no/admin/web-notification-list",
					{
					  user_id: user_id,
					},
					function(cardlist,status){
						$('.Allsharedcards').remove();
						var cardlistArr = jQuery.parseJSON(cardlist);
						if(!cardlistArr.error) {
							$.each( cardlistArr, function(i, row1) {
								$.each( row1, function(i, row) {							
									if (row.is_share_notify==1){
									$('.notification-list').append('<li class="Allsharedcards"><div class="img"><img src="https://www.nd2nosmart.cards/nd2no/upload/cards/thumb/'+row.banner+'" alt=""></div><div class="text">'+row.first_name+' '+row.middle_name+' '+row.last_name+' has shared his “<a href="javascript:void(0);" onClick="cartDetailsNotification('+row.id+');">'+row.title+'</a>” Card with you at '+row.updated_at+'</div></li>');
									} else {
									$('.notification-list').append('<li class="Allsharedcards"><div class="img"><img src="https://www.nd2nosmart.cards/nd2no/upload/cards/thumb/'+row.banner+'" alt=""></div><div class="text">'+row.first_name+' '+row.middle_name+' '+row.last_name+' has updated his “<a href="javascript:void(0);" onClick="cartDetailsNotification('+row.id+');">'+row.title+'</a>” Card at '+row.updated_at+'</div></li>');
									}
									
								});
							});
							$('.notificationlistloader').hide();
						} else {
							$('.notificationlistloader').hide();
							$(".errorMsgShow").show();
							$(".errorMsgShow").addClass("error");
							$(".errorMsgShow").text(cardlistArr.error);
						}
					}
				)
			} else {
				//$.mobile.changePage("#login");
			}
		});
		
		
			/*---------------Listing for selected cards--------------*/
		
		$(".counter-cardtick").click(function(){
			$.mobile.changePage("#selected-cards");
			$('.cardticklistloader').show();
			
			if (!localStorage.cartitem){
				var items = '';
			} else {
				var items =localStorage.cartitem;
			}
		
			$.post(
				"https://www.nd2nosmart.cards/nd2no/admin/web-selected-cards",
				{
				  selected_card_ids: items
				},
				function(cardlist,status){
					$('.Allselectedcards').remove();
					var cardlistArr = jQuery.parseJSON(cardlist);
					if(!cardlistArr.error) {
						$.each( cardlistArr, function(i, row1) {
							$.each( row1, function(i, row) {				
								$('.ticked-list').append('<li class="Allselectedcards"><div class="card-option"><a href="javascript:void(0);" class="tick-button ui-link"><img onClick="removeSelected('+row.id+');" src="images/delete-icon.png" alt=""></a></div><div class="img"><img src="https://www.nd2nosmart.cards/nd2no/upload/cards/large/'+row.banner+'" alt=""></div></li>');
							
							});
						});
						$('.cardticklistloader').hide();
					} else {
						$('.cardticklistloader').hide();
						$(".errorMsgShow").show();
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(cardlistArr.error);
					}
				}
			)
		});
		
		
		/*------------- Change Password -------------*/
		$('#changepassword_form').validate({
			rules: {
				current_password: {
					required: true, minlength: 6
				},
				new_password: {
					required: true, minlength: 6
				},
				password_confirmation: {
					required: true, equalTo: "#new_password", minlength: 6
				},
			},
			messages: {
				current_password: {
					required: "Please enter your current password."
				},
				new_password: {
					required: "Please enter your new password."
				},
				password_confirmation: {
					required: "Please enter your confirm password."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {	

				user_id = localStorage.getItem('userid');
				if(user_id==null || user_id==''){
					user_id = localStorage.getItem('userid-2');
				}
				if(user_id){		
					$.post(
						"https://www.nd2nosmart.cards/nd2no/admin/web-cahnge-password",
						{
						  current_password: $("#current_password").val(),
						  password: $("#new_password").val(),
						  password_confirmation: $("#password_confirmation").val(),
						  user_id: user_id
						},
						function(passwordData,status){
							var dataMsg = jQuery.parseJSON(passwordData);
							if(dataMsg.error){
								$(".errorMsgShow").show();
								$(".errorMsgShow").removeClass("success");
								$(".errorMsgShow").addClass("error");
								$(".errorMsgShow").text(dataMsg.error);	
							}
							if(dataMsg.success){
								$("#changepassword_form").trigger('reset');
								$(".errorMsgShow-2").show();
								$(".errorMsgShow-2").removeClass("error");
								$(".errorMsgShow-2").addClass("success");
								$(".errorMsgShow-2").text(dataMsg.success);
								$.mobile.changePage("#dashboard");								 
							}
						}
					)
				} else {
					//$.mobile.changePage("#login");	
				}
			}
		});
		
		

	});