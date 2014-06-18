package controller.action;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.ContentsVO;
import vo.DockingEnvironmentVO;
import vo.EditorVO;
import vo.JoinedMemberVO;
import vo.MemberContentsVO;
import vo.MemberVO;
import vo.TempVO;

public class ModifyAction {

	public void modifyContents(String mapper, ContentsVO vo){
		GenericService<ContentsVO>	s = new GenericServiceImpl<ContentsVO>();
		s.modify(mapper, vo);
	}

	public void modifyDockingEnvironment(String mapper, DockingEnvironmentVO vo){
		GenericService<DockingEnvironmentVO>	s = new GenericServiceImpl<DockingEnvironmentVO>();
		s.modify(mapper, vo);
	}

	public void modifyEditor(String mapper, EditorVO vo){
		GenericService<EditorVO>	s = new GenericServiceImpl<EditorVO>();
		s.modify(mapper, vo);
	}

	public void modifyJoinedMember(String mapper, JoinedMemberVO vo){
		GenericService<JoinedMemberVO>	s = new GenericServiceImpl<JoinedMemberVO>();
		s.modify(mapper, vo);
	}

	public void modifyMember(String mapper, MemberVO vo){
		GenericService<MemberVO>	s = new GenericServiceImpl<MemberVO>();
		s.modify(mapper, vo);
	}

	public void modifyMemberContents(String mapper, MemberContentsVO vo){
		GenericService<MemberContentsVO>	s = new GenericServiceImpl<MemberContentsVO>();
		s.modify(mapper, vo);
	}

	public void modifyTemp(String mapper, TempVO vo){
		GenericService<TempVO>	s = new GenericServiceImpl<TempVO>();
		s.modify(mapper, vo);
	}
}
