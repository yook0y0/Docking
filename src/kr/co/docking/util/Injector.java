package kr.co.docking.util;

import kr.co.docking.action.AddAction;
import kr.co.docking.action.DeleteAction;
import kr.co.docking.action.ModifyAction;
import kr.co.docking.action.SearchAction;
import kr.co.docking.controller.DocumentController;
import kr.co.docking.controller.EditorController;
import kr.co.docking.controller.MemberController;
import kr.co.docking.controller.ReviewController;

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
		else if(type == DocumentController.class)
		{
			return createDocumentController();
		}
		else if(type == EditorController.class)
		{
			return createEditorController();
		}
		else if(type == MemberController.class)
		{
			return createMemberController();
		}
		else if(type == ReviewController.class)
		{
			return createEditorReviewController();
		}
		return null;
	}
	
	private Object createEditorReviewController(){
		return new ReviewController();
	}

	private Object createMemberController() {
		// TODO Auto-generated method stub
		return new MemberController();
	}

	private Object createEditorController() {
		// TODO Auto-generated method stub
		return new EditorController();
	}

	private Object createDocumentController() {
		// TODO Auto-generated method stub
		return new DocumentController();
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
