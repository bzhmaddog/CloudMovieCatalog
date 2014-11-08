/** @jsx React.DOM */

define(['react'], function (React) {


	/**
	 * React : Dialog button component
	 */
	var DialogButton = React.createClass({
		render : function () {
			var btnClass = "btn btn-" + this.props.options.btnClass;

			return <button onClick={this.props.options.handleClick} type="button" className={btnClass} data-dismiss="modal" data-action={this.props.options.action}>{this.props.options.text}</button>
		}
	});

	/**
	 * React : Dialog component using Bootstrap modal
	 */
	var ConfirmDialog = React.createClass({
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
	
				return <DialogButton key={'button-' + index} options={btnModel} />;
			});

			return	<div className={"modal-dialog"}>
						<div className={"modal-content"}>
							<div className={"modal-header"}>
								<button type="button" className={"close"} data-dismiss="modal" aria-hidden="true">&times;</button>
								<h4 className={"modal-title"}>{this.props.options.title}</h4>
							</div>
							<div className={"modal-body"}>
								<p>{this.props.options.text}</p>
								<p className={"text-warning"}><small>{this.props.options.extra}</small></p>
							</div>
							<div className={"modal-footer"}>
								{buttons}
							</div>
						</div>
					</div>;
		}
	});


	return {
		DialogButton : DialogButton,
		ConfirmDialog : ConfirmDialog
	}
});