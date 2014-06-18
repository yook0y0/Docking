package util;

import controller.ContentsController;
import controller.DockingEnvironmentController;
import controller.EditorController;
import controller.EmailController;
import controller.JoinedMemberController;
import controller.LogInOutController;
import controller.MemberContentsController;
import controller.MemberController;
import controller.TempController;
import controller.action.AddAction;
import controller.action.DeleteAction;
import controller.action.ModifyAction;
import controller.action.SearchAction;

public class Injector
{
	private static Injector instance;
	static
	{
		instance = new Injector();
	}
	
	private Injector(){
		
	}
	
	public static Injector getInstance()
	{
		return instance;
	}
	
	@SuppressWarnings("rawtypes")
	public Object getObject(Class type)
	{
		/*
		 * Action
		 */
		if(type == AddAction.class)
		{
			return createAddAction();
		}
		else if(type == DeleteAction.class)
		{
			return createDeleteAction();
		}
		else if(type == ModifyAction.class)
		{
			return createModifyAction();
		}
		else if(type == SearchAction.class)
		{
			return createSearchAction();
		}
		/*
		 * Controller
		 */
		else if(type == ContentsController.class)
		{
			return createContentsController();
		}
		else if(type == DockingEnvironmentController.class)
		{
			return createDockingEnvironmentController();
		}
		else if(type == EditorController.class)
		{
			return createEditorController();
		}
		else if(type == EmailController.class)
		{
			return createEmailController();
		}
		else if(type == JoinedMemberController.class)
		{
			return createJoinedMemberController();
		}
		else if(type == LogInOutController.class)
		{
			return createLogInOutController();
		}
		else if(type == MemberContentsController.class)
		{
			return createMemberContentsController();
		}
		else if(type == MemberController.class)
		{
			return createMemberController();
		}
		else if(type == TempController.class)
		{
			return createTempController();
		}
		return null;
	}
	
	private Object createTempController() {
		// TODO Auto-generated method stub
		return new TempController();
	}

	private Object createMemberController() {
		// TODO Auto-generated method stub
		return new MemberController();
	}

	private Object createMemberContentsController() {
		// TODO Auto-generated method stub
		return new MemberContentsController();
	}

	private Object createLogInOutController() {
		// TODO Auto-generated method stub
		return new LogInOutController();
	}

	private Object createJoinedMemberController() {
		// TODO Auto-generated method stub
		return new JoinedMemberController();
	}

	private Object createEmailController() {
		// TODO Auto-generated method stub
		return new EmailController();
	}

	private Object createEditorController() {
		// TODO Auto-generated method stub
		return new EditorController();
	}

	private Object createDockingEnvironmentController() {
		// TODO Auto-generated method stub
		return new DockingEnvironmentController();
	}

	private Object createContentsController() {
		// TODO Auto-generated method stub
		return new ContentsController();
	}

	private Object createSearchAction() {
		// TODO Auto-generated method stub
		return new SearchAction();
	}

	private Object createModifyAction() {
		// TODO Auto-generated method stub
		return new ModifyAction();
	}

	private Object createDeleteAction() {
		// TODO Auto-generated method stub
		return new DeleteAction();
	}

	private Object createAddAction() {
		// TODO Auto-generated method stub
		return new AddAction();
	}
	

}
