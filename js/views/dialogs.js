/** @jsx React.DOM */

define(['react'], function (React) {


	/**
	 * React : Dialog button component
	 */
	var DialogButton = React.createClass({displayName: 'DialogButton',
		render : function () {
			var btnClass = "btn btn-" + this.props.options.btnClass;

			return React.createElement("button", {onClick: this.props.options.handleClick, type: "button", className: btnClass, 'data-dismiss': "modal", 'data-action': this.props.options.action}, this.props.options.text)
		}
	});

	/**
	 * React : Dialog component using Bootstrap modal
	 */
	var ConfirmDialog = React.createClass({displayName: 'ConfirmDialog',
		componentDidUpdate : function () {
			//$("#js-confirm-dialog").modal('show'); // show the modal automatically when the component update
		},
		// handle click events on the buttons
		handleClick : function (ev) {
			var action = $(ev.target).data('action'),
				buttons = this.props.options.buttons,
				l = buttons.length;

			for (var i = 0 ; i < l ; i++) {
				if (buttons[i].action === action && typeof buttons[i].callback === 'function') {
					buttons[i].callback.call(this, ev);
					break;
				}
			}
		},
		render : function () {
			var _handleClick = this.handleClick,
				buttons;

			buttons = this.props.options.buttons.map(function (button, index) {
				var btnModel = button;
				btnModel.handleClick = _handleClick;
				//delete btnModel.callback;
	
				return React.createElement(DialogButton, {key: 'button-' + index, options: btnModel});
			});

			return	React.createElement("div", {className: "modal-dialog"}, 
						React.createElement("div", {className: "modal-content"}, 
							React.createElement("div", {className: "modal-header"}, 
								React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal", 'aria-hidden': "true"}, "×"), 
								React.createElement("h4", {className: "modal-title"}, this.props.options.title)
							), 
							React.createElement("div", {className: "modal-body"}, 
								React.createElement("p", null, this.props.options.text), 
								React.createElement("p", {className: "text-warning"}, React.createElement("small", null, this.props.options.extra))
							), 
							React.createElement("div", {className: "modal-footer"}, 
								buttons
							)
						)
					);
		}
	});


	return {
		DialogButton : DialogButton,
		ConfirmDialog : ConfirmDialog
	}
});